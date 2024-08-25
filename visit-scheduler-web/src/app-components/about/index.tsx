import Link from "next/link";
import { FC } from "react";

const AbputPage: FC = () => {
  return (
    <div className="size-full flex flex-col items-start md:w-3/4 px-8">
      <div className="flex w-full py-16 flex-col items-start space-y-4">
        <h1 className="text-xl p-4">開発者について</h1>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">名前</div>
          <div className="grow">大橋瑞輝</div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">GitHub</div>
          <div className="grow">
            <Link className="underline" href="https://github.com/Mizuki-OHASHI" target="_blank">
              Mizuki-OHASHI
            </Link>
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">所属</div>
          <div className="grow">
            東京大学
            <br />
            教養学部理科一類 → 工学部物理工学科
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">むら塾では</div>
          <div className="grow break-words">
            9 期
            <br />
            元 農業G 野菜担当
            <br />
            会計 兼 執行部外局訪問管理担当、広報イベG HP担当
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">その他</div>
          <div className="grow">
            むら塾のほか{" "}
            <Link className="underline" href="https://www.uttc.dev/" target="_blank">
              UTokyo Tech Club
            </Link>{" "}
            というWeb開発のサークルに所属しています。 もし興味があればぜひお声がけください。
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">連絡先</div>
          <div className="grow">
            ECCSアカウントのユーザー名は <span className="font-mono">ohashi-mizuki0510</span> です。
            この後に学生共通のドメインをつけたものがメールアドレスです。
          </div>
        </div>
      </div>
      <div className="flex w-full py-16 flex-col items-start space-y-4">
        <h1 className="text-xl p-4">本サービスについて</h1>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">概要</div>
          <div className="grow break-words">
            本サービスは、東大むら塾の相川訪問のメンバー決めを支援するために開発されました。
            メンバーの調整さんの回答と、直近の訪問日や運転できるかなどの情報をもとに、訪問スケジュールを最適化します。
            <br />
            内部的にはスケジューリング問題を線形な最小化問題として定式化し、混合整数線型計画ソルバーを用いることで最適化を行っています。
            <Link
              className="underline"
              href="https://defiant-leopon-a5f.notion.site/e2b4706bcc33456f9e8c58640b610382#dd9cc1c5d06946738a02d43054336ed5"
              target="_blank"
            >
              こちら
            </Link>
            に詳細な説明があります。
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">動作環境</div>
          <div className="grow break-words">
            本サービスは Firefox および Chrome
            での動作を確認しています。その他のブラウザでは正常に動作しない可能性があります。
            また、スマートフォンやタブレットでは正常に動作しない可能性があります。
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">フィードバック</div>
          <div className="grow break-words">
            本サービスに関して、バグ報告や機能追加のリクエストなどがあれば、
            <Link
              className="underline"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfEUb2Dxdlnc_J_jchvDwGoz6J0r6Pl9DV4NFZ7fAY1QVsGuQ/viewform?usp=sf_link"
              target="_blank"
            >
              こちら
            </Link>
            の Google フォームからお知らせください。お急ぎの場合は Slack ないしメールでお知らせいただいても構いません。
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">ソース・ライセンス</div>
          <div className="grow break-words">
            本サービスはオープンソースであり、
            <Link className="underline" href="https://github.com/Mizuki-OHASHI/visit-scheduler/" target="_blank">
              GitHub
            </Link>
            で公開されています。MIT ライセンスの下で提供されています。
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3 shrink-0">バージョン</div>
          <div className="grow break-words">
            現在公開中のサービスは アルファ版 です。最適化が行われた後の手動による調整機能などの実装が予定されています。
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbputPage;
