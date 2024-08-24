import io
import re
from datetime import date
from time import time
from typing import Dict, List, Optional, Tuple

import pandas as pd
import requests

from lib.datetime import parse_date
from lib.format_name import format_name
from lib.logger import logger
from schema.enum import ScheduleStatus
from schema.schedule import ScheduleMaster
from schema.user import VisitUserSchedule


def get_schedule_from_chouseisan(
    chouseisan_id: str,
) -> Optional[Tuple[ScheduleMaster, Dict[str, List[VisitUserSchedule]]]]:
    """調整さんの ID から CSV データを取得し、スケジュール情報を取得する"""

    raw_csv = fetch_chouseisan(chouseisan_id)
    if raw_csv is None:
        return None

    df, title = parse_raw_csv(raw_csv)

    candidates = extract_candidates(df)

    schedule_master = ScheduleMaster(
        chouseisan_id=chouseisan_id,
        title=title,
        candidates=candidates,
    )

    visit_users_schedule = extract_visit_users_schedule(df)

    return schedule_master, visit_users_schedule


def fetch_chouseisan(chouseisan_id: str) -> Optional[str]:
    """調整さんから CSV データを取得する HTTP リクエストを行う"""

    if chouseisan_id is None or len(chouseisan_id) == 0:
        raise ValueError("invalid chouseisan ID")
    chouseisan_url_format = (
        "https://chouseisan.com/schedule/List/createCsv?h={}&charset=utf-8&row=choice"
    )
    url = chouseisan_url_format.format(chouseisan_id)

    start_time = time()
    response = requests.get(url)
    if response.status_code != 200:
        if response.status_code == 404:
            logger.error("chouseisan not found: %s", url)
        else:
            logger.error("failed to fetch chouseisan: %s", url)
        return None

    process_time = time() - start_time

    # logging
    logger.info("fetched chouseisan: %s (%.2f sec)", url, process_time)
    return response.text


def parse_raw_csv(raw_csv: str) -> Tuple[pd.DataFrame, str]:
    """調整さんの CSV データを整形する

    入力例:
        対面活動
        "相川での活動の日程決めの参考にします！
        ※10/5,6は総会、パン×海龍寺の予定です。これらに参加する予定の人も〇としてください"
        日程,みずき,ひろし,たかし,ゆうすけ,まさき,たけし
        9/28(土) ,◯,×,◯,△,◯,◯
        9/29(日) ,△,◯,×,◯,◯,◯
        ...
    """
    title = re.search(r"^.*\n", raw_csv).group().strip()

    df = pd.read_csv(io.StringIO(raw_csv), skiprows=2)
    return df, title


def extract_candidates(df: pd.DataFrame) -> List[date]:
    """データフレームから候補日を抽出する"""

    candidates_col = df["日程"].tolist()[:-1]  # 最終行はコメントなので除外
    candidates = [parse_date(c) for c in candidates_col]

    return candidates


def extract_visit_users_schedule(
    df: pd.DataFrame,
) -> Dict[str, List[VisitUserSchedule]]:
    """データフレームから訪問メンバーの日程を抽出する

    Returns: dict(名前 -> 日程のリスト)
    """

    visit_schedules = {}
    candidates_col = df["日程"].tolist()[:-1]  # 最終行はコメントなので除外
    colmuns = df.columns
    for name in colmuns[1:]:
        row = df[name].tolist()[:-1]  # 最終行はコメントなので除外
        schedules = [
            VisitUserSchedule(
                candidate=parse_date(candidates_col[i]),
                status=parse_schedule_status(v).value,
            )
            for i, v in enumerate(row)
        ]
        formatted_name = format_name(name)
        visit_schedules[formatted_name] = schedules

    return visit_schedules


def parse_schedule_status(v: str) -> ScheduleStatus:
    """調整さんの日程ステータスを変換する

    - ◯ → ScheduleStatus.preferred
    - △ → ScheduleStatus.available
    - × →  ScheduleStatus.unavailable
    """
    if v == "◯":
        return ScheduleStatus.preferred
    elif v == "△":
        return ScheduleStatus.available
    else:
        if v != "×":
            logger.warning("unknown schedule status: %s", v)
        return ScheduleStatus.unavailable
