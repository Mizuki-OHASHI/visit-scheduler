def format_name(name: str):
    """名前を整形する

    - 氏名の間のスペースを削除
    """

    return name.replace(" ", "").replace("　", "")
