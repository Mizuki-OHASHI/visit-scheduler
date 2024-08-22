from datetime import date, datetime


def parse_date(date_str: str, default_year: int = None) -> date:
    """文字列から日付をパースする

    入力例: "2024/5/6", "3/5", "3/5(金)", "3/5（金）", "3／5", ...
    """

    try:
        year = default_year if default_year is not None else date.today().year
        date_str = date_str.replace("（", "(").replace("）", ")")
        date_str = date_str.replace("／", "/")
        if "(" in date_str:
            date_str = date_str[: date_str.index("(")]
        splitted = list(map(int, date_str.split("/")))
        if len(splitted) == 2:
            month, day = splitted
        elif len(splitted) == 3:
            year, month, day = splitted
        else:
            raise ValueError(f"invalid date format: {date_str}")
        return date(year, month, day)

    except ValueError:
        raise ValueError(f"invalid date format: {date_str}")


def date_to_datetime(date: date) -> datetime:
    return datetime(date.year, date.month, date.day)
