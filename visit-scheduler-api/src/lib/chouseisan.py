from time import time
import io
from typing import List, Optional, Tuple
import pandas as pd
import requests
from lib.datetime import parse_date
from schema.schedule import Candidate, ScheduleMaster
from src.lib.logger import logger
import re


def get_schedule_from_chouseisan(chouseisan_id: str) -> Optional[ScheduleMaster]:
    """
    調整さんの ID から CSV データを取得し、整形したデータフレームを返す
    """

    raw_csv = fetch_chouseisan(chouseisan_id)
    if raw_csv is None:
        return None

    df, title = parse_raw_csv(raw_csv)

    candidates = extract_candidates(df)

    schedule_master = ScheduleMaster(
        chouseisan_id=chouseisan_id,
        title=title,
        candidates=candidates,
        groups=[],
    )

    return schedule_master


def fetch_chouseisan(chouseisan_id: str) -> Optional[str]:
    """
    調整さんから CSV データを取得する HTTP リクエストを行う
    """

    if chouseisan_id is None or len(chouseisan_id) == 0:
        raise ValueError("invalid chouseisan ID")
    chouseisan_url_format = (
        # "https://chouseisan.com/schedule/List/createCsv?h={}&charset=utf-8&row=member"
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
    """
    調整さんの CSV データを整形する

    入力例:
        対面活動
        "相川での活動の日程決めの参考にします！
        ※10/5,6は総会、パン×海龍寺の予定です。これらに参加する予定の人も〇としてください"
        日程,みずき,ひろし,たかし,ゆうすけ,まさき,たけし
        9/28(土) ,◯,×,◯,△,◯,◯
        9/29(日) ,△,◯,×,◯,◯,◯
        ...
    """
    title = re.search(r"^.*\n", raw_csv).group()

    df = pd.read_csv(io.StringIO(raw_csv), skiprows=2)
    return df, title


def extract_candidates(df: pd.DataFrame) -> List[Candidate]:
    """
    データフレームから候補日を抽出する
    """

    candidates_col = df["日程"].tolist()[:-1]  # 最終行はコメントなので除外
    parsed_candidates = [parse_date(c) for c in candidates_col]
    candidates = [Candidate(date=c, group=None) for c in parsed_candidates]

    return candidates
