from time import time
from typing import Any, Callable, Coroutine

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from src.dao.user import AppUserDao
from src.router import router_list
from src.lib.firebase import get_verify_token


app = FastAPI()


def custom_openapi():
    """
    認証のための OpenAPI スキーマを追加する
    """
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


#################### Middleware ####################

# CORS 設定
# 処理時間のヘッダー追加
# ユーザー ID のバリデーション

# 下から順に処理されることに注意


def validate_uid(uid: Any) -> bool:
    """
    有効な UID かどうかを検証する
    """
    return isinstance(uid, str) and len(uid) > 0


@app.middleware("http")
async def authorization(
    request: Request,
    call_next: Callable[[Request], Coroutine[None, None, Response]],
    verify_token: Callable[[str], dict] = get_verify_token(),
) -> Response:
    """
    認証を行う

    - Bearer トークンを取得し, ユーザーを取得する
    - ユーザーが存在しない場合は 401 エラーを返す (一部例外あり)
    """

    # いくつかのエンドポイントは認証をスキップする
    ignore_paths_and_methods = [
        ("/health", "GET"),
        ("/docs", "GET"),
        ("/openapi.json", "GET"),
    ]
    for path, method in ignore_paths_and_methods:
        if path == request.url.path[: len(path)] and method == request.method:
            return await call_next(request)

    # Bearer トークンを取得し, UID を取得する
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        return Response(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"message": "bearer token is required."},
        )

    token_body = token[len("Bearer ") :]
    try:
        decoded_token = verify_token(token_body)
    except Exception as e:
        print(e)
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

    request.state.uid = uid

    user = AppUserDao().get_by_id(uid)
    if user is None:
        # サインアップの場合
        if request.url.path == "/me" and request.method == "POST":
            return await call_next(request)

        return Response(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"message": "user not found."},
        )

    request.state.actor = user

    response = await call_next(request)
    return response


@app.middleware("http")
async def add_process_time_header(
    request: Request,
    call_next: Callable[[Request], Coroutine[None, None, Response]],
) -> Response:
    """
    - リクエストの処理時間をヘッダーに追加する
    - OPTIONS メソッドの場合は直ちに 204 を返す
    """
    if request.method == "OPTIONS":
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    start_time = time()
    response = await call_next(request)
    process_time = time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


#################### Endpoints ####################


@app.get("/health")
def health():
    return {"status": "ok"}


for router in router_list:
    app.include_router(router)
