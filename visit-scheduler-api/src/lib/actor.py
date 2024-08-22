from fastapi import Request
from src.schema.user import AppUser


def get_actor_from_state(request: Request) -> AppUser:
    try:
        actor = request.state.actor
    except AttributeError:
        raise Exception("actor is not set.")
    if isinstance(actor, AppUser):
        return actor
    raise Exception("invalid actor type.")
