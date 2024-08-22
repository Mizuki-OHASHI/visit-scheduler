from ulid import ulid


def new_id() -> str:
    return ulid()
