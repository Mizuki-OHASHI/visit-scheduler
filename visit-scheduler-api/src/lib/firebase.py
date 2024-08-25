from typing import Callable

from firebase_admin import auth, credentials, firestore, initialize_app

cred = credentials.Certificate("service_account_key")
fire_app = initialize_app(cred)


def get_app():
    return fire_app


def get_verify_token() -> Callable[[str], dict]:
    def verify_token(token):
        decoded_token = auth.verify_id_token(token)
        if isinstance(decoded_token, dict):
            return decoded_token
        raise ValueError("invalid token")

    return verify_token


def get_db_client():
    return firestore.client(fire_app)
