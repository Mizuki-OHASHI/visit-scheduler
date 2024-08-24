import Link from "next/link";
import { FC, useMemo, useState } from "react";
import { MdSync } from "react-icons/md";

import MemberItem from "#/member/member-item";
import { useMember } from "@/api/useMember";
import InputWithButton from "@/components/input/input-with-button";
import { spreadsheetIdSchema } from "@/schema/id";

const MemberPage: FC = () => {
  const spreadSheetExample =
    "https://docs.google.com/spreadsheets/d/1yVR0FWdVUVEIKwNdyb-WGY-d_cZOD4-dGip2g-4GzCU/edit?usp=sharing";
  const [googleSpreadSheetLink, setGoogleSpreadSheetLink] = useState<string>("");
  const { syncSpreadsheetMember, fetchAllMembers } = useMember();

  const visitUsers = useMemo(() => fetchAllMembers.data ?? [], [fetchAllMembers.data]);

  const syncSpreadsheetHandler = (spreadsheetLink: string) => {
    const { data: spradsheetId, success } = spreadsheetIdSchema.safeParse(spreadsheetLink);

    if (!success) {
      alert("リンクが無効です。");
      return;
    }

    syncSpreadsheetMember
      .trigger({ data: { spreadsheet_id: spradsheetId } })
      .then((result) => {
        fetchAllMembers.refetch();
        alert(`メンバー情報を同期しました。追加: ${result.added} 件、更新: ${result.updated} 件`);
      })
      .catch((error) => {
        console.error(error);
        alert("スプレッドシートの同期に失敗しました。");
      });
  };

  return (
    <div className="flex size-full flex-col p-8 lg:w-3/4">
      <details className="flex w-full flex-col items-center space-y-4">
        <summary className="text-2xl">
          <span className="px-4">スプレッドシートから読み込む</span>
        </summary>
        <div className="flex w-full flex-col items-center space-y-4">
          <div>Google スプレッドシートの共有リンクを入力し、メンバー情報を同期します。</div>
          <InputWithButton
            value={googleSpreadSheetLink}
            onChange={(v) => setGoogleSpreadSheetLink(v)}
            onClick={syncSpreadsheetHandler}
            buttonIcon={<MdSync size={24} color="gray" />}
            placeholder={spreadSheetExample}
          />
          <details className="w-full">
            <summary>注意</summary>
            <div className="w-full p-4 text-sm">
              <span className="font-medium">・同一の氏名、入会期のメンバーは上書きされます。</span>
              <br />
              ・スプレッドシートで氏名、入会期、性別、直近の訪問、運転、担当カラムを用意し、必要な情報を記入します。
              <Link href={spreadSheetExample} target="_blank" className="underline">
                こちら
              </Link>
              のスプレッドシートを参考にしてください。
              <br />
              ・スプレッドシートの共有権限はすべてのユーザーが閲覧できる状態にしてください。
              <br />
              ・1番目のシートに情報を記入してください。
            </div>
          </details>
        </div>
      </details>
      <div className="mb-6 mt-12 w-full text-center text-2xl">【 メンバー一覧 】</div>
      <div className="flex flex-col space-y-2 pb-16 text-sm sm:text-base">
        <div className="flex w-full items-center space-x-2 border-b border-slate-700 px-4 py-2 text-center">
          <div className="w-1/6 shrink-0">氏名</div>
          <div className="w-1/6 shrink-0">直近の訪問</div>
          <div className="w-1/12 shrink-0">入会</div>
          <div className="w-1/12 shrink-0">性別</div>
          <div className="w-1/6 shrink-0">運転</div>
          <div className="flex grow flex-wrap justify-center">担当</div>
        </div>
        {visitUsers.map((visitUser) => (
          <MemberItem key={visitUser.id} visitUser={visitUser} />
        ))}
      </div>
    </div>
  );
};

export default MemberPage;
