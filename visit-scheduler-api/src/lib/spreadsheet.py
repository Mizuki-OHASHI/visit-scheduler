# Standard Library
import io
from datetime import datetime
from hmac import new
from time import time
from typing import List, Optional

# Third Party Library
import pandas as pd
import requests

# First Party Library
from lib.datetime import parse_date
from lib.format_name import format_name
from lib.id import new_id
from lib.logger import logger
from schema.enum import DriverLevel, Gender
from schema.user import VisitUser


def get_member_from_spreadsheet(spreadsheet_id: str) -> Optional[List[VisitUser]]:
    """Google Spreadsheet からメンバー情報を取得する"""

    csv = fetch_spreadsheet(spreadsheet_id)
    if csv is None:
        return None

    visit_users = csv_to_visit_users(csv)
    return visit_users


def fetch_spreadsheet(spreadsheet_id: str) -> Optional[str]:
    """Google Spreadsheet から CSV データを取得する HTTP リクエストを行う

    `curl -L "https://docs.google.com/spreadsheets/d/1DdbyDNKMzAxjkE1JKZ0EtJQUdomvqqMyD9r6inJEsmU/export?format=csv"`
    """

    if spreadsheet_id is None or len(spreadsheet_id) == 0:
        raise ValueError("invalid spreadsheet ID")
    spreadsheet_url_format = (
        "https://docs.google.com/spreadsheets/d/{}/export?format=csv"
    )
    url = spreadsheet_url_format.format(spreadsheet_id)

    start_time = time()
    response = requests.get(url)
    if response.status_code != 200:
        if response.status_code == 404:
            logger.error("spreadsheet not found: %s", url)
        else:
            logger.error("failed to fetch spreadsheet: %s", url)
        return None

    process_time = time() - start_time

    # logging
    logger.info("fetched spreadsheet: %s (%.2f sec)", url, process_time)

    # レスポンスを UTF-8 でデコードして返す
    return response.content.decode("utf-8")


def csv_to_visit_users(csv: str) -> List[VisitUser]:
    """CSV データを VisitUser のリストに変換する"""

    df = pd.read_csv(io.StringIO(csv))

    required_columns = ["氏名", "入会期", "性別", "直近の訪問", "運転", "担当"]
    for column in required_columns:
        if column not in df.columns:
            raise ValueError(f"required column '{column}' not found")

    visit_users = []
    gender_map = lambda x: (
        (Gender.male if x == 0 else Gender.female if x == 1 else Gender.other).value
    )
    driver_level_map = lambda x: (
        (
            DriverLevel.beginner
            if x == 1
            else (
                DriverLevel.intermediate
                if x == 2
                else DriverLevel.advanced if x == 3 else DriverLevel.unable
            )
        ).value
    )
    tasks_map = lambda x: (
        [v.strip() for v in x.split("/")] if isinstance(x, str) else []
    )
    id = new_id()
    for _, row in df.iterrows():
        visit_user = VisitUser(
            name=format_name(row["氏名"]),
            entry_cohort=int(row["入会期"]),
            last_visit=parse_date(row["直近の訪問"]),
            gender=gender_map(row["性別"]),
            driver_level=driver_level_map(row["運転"]),
            responsible_tasks=tasks_map(row["担当"]),
            id=new_id(),
            app_user_id=None,
            created_at=datetime.now(),
        )
        visit_users.append(visit_user)

    return visit_users
