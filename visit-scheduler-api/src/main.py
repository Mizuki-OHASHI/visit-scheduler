from time import time
from typing import Any, Callable, Coroutine

from fastapi import Depends, FastAPI, Request, Response, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from google.cloud.firestore import Client

from src.dao.user import AppUserDao
from src.router import router_list
from src.lib.firebase import get_verify_token
from src.dao.dao import get_db


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Custom API",
        version="1.0.0",
        description="This is a custom OpenAPI schema",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.middleware("http")
async def add_process_time_header(
    request: Request,
    call_next: Callable[[Request], Coroutine[None, None, Response]],
) -> Response:
    start_time = time()
    response = await call_next(request)
    process_time = time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


def validate_uid(uid: Any) -> bool:
    return isinstance(uid, str) and len(uid) > 0


@app.middleware("http")
async def authorization(
    request: Request,
    call_next: Callable[[Request], Coroutine[None, None, Response]],
    verify_token: Callable[[str], dict] = Depends(get_verify_token),
    db: Client = Depends(get_db),
) -> Response:
    # いくつかのエンドポイントは認証をスキップする
    ignore_paths_and_methods = [
        ("/health", "GET"),
        ("/user", "POST"),
        ("/docs", "GET"),
        ("/openapi.json", "GET"),
    ]
    for path, method in ignore_paths_and_methods:
        if path == request.url.path[: len(path)] and method == request.method:
            return await call_next(request)

    # Bearer トークンを取得し, UID を取得する
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        # raise HTTPException(status_code=401, detail="bearer token is required.")
        return Response(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"message": "bearer token is required."},
        )

    token_body = token[len("Bearer ") :]
    try:
        decoded_token = verify_token(token_body)
    except Exception:
        # raise HTTPException(status_code=401, detail="invalid token.")
        return Response(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"message": "invalid token."},
        )

    uid = decoded_token["uid"]

    # UID のバリデーションを行い, ユーザーを取得する
    if not validate_uid(uid):
        return Response(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"message": "invalid UID."},
        )

    user = AppUserDao(db).get_by_id(uid)
    if user is None:
        # サインアップの場合
        if request.url.path == "/user" and request.method == "POST":
            request.state.uid = uid
            return await call_next(request)

        # raise HTTPException(status_code=401, detail="user not found.")
        return Response(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"message": "user not found."},
        )

    request.state.actor = user

    response = await call_next(request)
    return response


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Hello World"}


for router in router_list:
    app.include_router(router)
