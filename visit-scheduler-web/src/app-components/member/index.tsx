import { visitUserSchema } from "@/schema/user";
import { FC, useState } from "react";
import MemberItem from "./member-item";
import InputWithButton from "@/components/input/input-with-button";
import { MdSync } from "react-icons/md";

const MemberPage: FC = () => {
  const spreadSheetExample =
    "https://docs.google.com/spreadsheets/d/1yVR0FWdVUVEIKwNdyb-WGY-d_cZOD4-dGip2g-4GzCU/edit?usp=sharing";
  const [googleSpreadSheetLink, setGoogleSpreadSheetLink] = useState("");

  const visitUsers = visitUserSchema.array().parse([
    {
      id: "1",
      profile: {
        name: "大橋瑞輝",
        last_visit: "2021-10-01",
        entry_cohort: 9,
        gender: "male",
        driver_level: "unable",
        responsible_tasks: ["訪問管理", "会計"],
      },
      schedules: [],
      created_at: "2021-10-01",
    },
    {
      id: "2",
      profile: {
        name: "大橋柚佳",
        last_visit: "2021-10-01",
        entry_cohort: 10,
        gender: "female",
        driver_level: "unable",
        responsible_tasks: ["デザイン", "会計"],
      },
      schedules: [],
      created_at: "2021-10-01",
    },
  ]);

  // https://docs.google.com/spreadsheets/d/1yVR0FWdVUVEIKwNdyb-WGY-d_cZOD4-dGip2g-4GzCU/edit?usp=sharing
  // https://docs.google.com/spreadsheets/d/1DdbyDNKMzAxjkE1JKZ0EtJQUdomvqqMyD9r6inJEsmU/edit?usp=sharing
  // curl -L "https://docs.google.com/spreadsheets/d/1DdbyDNKMzAxjkE1JKZ0EtJQUdomvqqMyD9r6inJEsmU/export?format=csv"

  return (
    <div className="size-full lg:w-3/4 p-8 flex flex-col">
      <details className="flex w-full flex-col items-center space-y-4">
        <summary className="text-2xl">
          <span className="px-4">スプレッドシートから読み込む</span>
        </summary>
        <div className="w-full space-y-4 flex flex-col items-center">
          <div>Google スプレッドシートの共有リンクを入力し、メンバー情報を同期します。</div>
          <InputWithButton
            value={googleSpreadSheetLink}
            onChange={(v) => setGoogleSpreadSheetLink(v)}
            onClick={(v) => {}}
            buttonIcon={<MdSync size={24} color="gray" />}
            placeholder={spreadSheetExample}
          />
          <details className="w-full">
            <summary>注意</summary>
            <div className="w-full p-4 text-sm">
              <span className="font-medium">・同一の氏名、入会期のメンバーは上書きされます。</span>
              <br />
              ・スプレッドシートで氏名、入会期、性別、直近の訪問、運転、担当カラムを用意し、必要な情報を記入します。
              <a href={spreadSheetExample} target="_blank" className="underline">
                こちら
              </a>
              のスプレッドシートを参考にしてください。
              <br />
              ・スプレッドシートの共有権限はすべてのユーザーが閲覧できる状態にしてください。
              <br />
              ・一番初めのシートに情報を記入してください。
            </div>
          </details>
        </div>
      </details>
      <div className="text-2xl w-full text-center mt-12 mb-6">【 メンバー一覧 】</div>
      <div className="flex flex-col space-y-2">
        <div className="w-full h-8 border-b border-slate-700 flex space-x-2 items-center px-4 text-center">
          <div className="w-1/6 shrink-0">氏名</div>
          <div className="w-1/6 shrink-0">直近の訪問</div>
          <div className="w-1/12 shrink-0">入会</div>
          <div className="w-1/12 shrink-0">性別</div>
          <div className="w-1/12 shrink-0">運転</div>
          <div className="flex flex-wrap grow justify-center">担当</div>
        </div>
        {visitUsers.map((visitUser) => (
          <MemberItem key={visitUser.id} visitUser={visitUser} />
        ))}
      </div>
    </div>
  );
};

export default MemberPage;
