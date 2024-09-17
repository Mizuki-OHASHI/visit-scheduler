import { FC, useState } from "react";
import { MdSync } from "react-icons/md";

import { useManySchedules } from "@/api/useSchedule";
import InputWithButton from "@/components/input/input-with-button";
import { chouseisanIdSchema } from "@/schema/id";
import { SyncChouseisanResult } from "@/schema/schedule";

type ScheduleRegisterProps = {
  refetchSchedules: () => void;
};

const ScheduleRegister: FC<ScheduleRegisterProps> = ({ refetchSchedules }) => {
  const chouseisanPlaceholder = "https://chouseisan.com/s?h=0123456789abcdef0123456789abcdef";
  const [chouseisanLink, setChouseisanLink] = useState("");
  const [result, setResult] = useState<SyncChouseisanResult | null>(null);

  const { syncChouseisan } = useManySchedules();

  const syncChouseisanHandler = (chouseisanLink: string) => {
    const { data: chouseisanId, success } = chouseisanIdSchema.safeParse(chouseisanLink);
    if (!success) {
      alert("リンクが無効です。");
      return;
    }
    syncChouseisan
      .trigger({ data: { chouseisan_id: chouseisanId } })
      .then((data) => {
        refetchSchedules();
        setResult(data);
        if (data.diff_visit_users.length > 0)
          alert(
            [
              "登録されていないメンバーが見つかりました。",
              "スケジュール調整を行う前にメンバーを登録してください。また、調整さんに入力された名前に誤りがないか確認してください。",
              `(未登録のメンバー ${data.diff_visit_users.length} 名) `,
            ].join("\n"),
          );
      })
      .catch((error) => {
        console.error(error);
        alert("調整さんのデータ取得に失敗しました。");
      });
  };

  return (
    <div className="flex w-full flex-col items-center space-y-4 px-4">
      <div>
        調整さんのリンクを入力し、メンバーのスケジュールを同期します。
        <br />
        登録済みのスケジュールは上書きされます。
      </div>
      <InputWithButton
        value={chouseisanLink}
        onChange={(v) => setChouseisanLink(v)}
        onClick={syncChouseisanHandler}
        buttonIcon={<MdSync size={24} color="gray" />}
        placeholder={chouseisanPlaceholder}
      />
      {result && (
        <div className="flex w-full flex-col justify-start space-y-2">
          <div>同期が完了しました。</div>
          <details className="flex flex-col justify-start space-y-2" open>
            <summary>
              <span className="px-2">概要</span>
            </summary>
            <div className="flex items-center justify-start">
              <div className="w-20 shrink-0 text-slate-500">タイトル</div>
              <div>{result.schedule_master.title}</div>
            </div>
            <div className="flex items-center justify-start">
              <div className="w-20 shrink-0 text-slate-500">候補日</div>
              <div className="grow break-words">
                {result.schedule_master.candidates.map((date) => date.format("M/D")).join(", ")}
              </div>
            </div>
            {result.diff_visit_users.length > 0 && (
              <div className="flex items-center justify-start">
                <div className="w-20 shrink-0 text-slate-500">
                  未登録の
                  <br />
                  メンバー
                </div>
                <div className="grow break-words">{result.diff_visit_users.map((name) => name).join(", ")}</div>
              </div>
            )}
          </details>
        </div>
      )}
    </div>
  );
};

export default ScheduleRegister;
