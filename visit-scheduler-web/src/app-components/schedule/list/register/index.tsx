import { FC, useState } from "react";
import { MdSync } from "react-icons/md";

import { useSchedule } from "@/api/useSchedule";
import InputWithButton from "@/components/input/input-with-button";
import { chouseisanIdSchema } from "@/schema/id";
import { ScheduleMaster } from "@/schema/schedule";

type ScheduleRegisterProps = {
  refetchSchedules: () => void;
};

const ScheduleRegister: FC<ScheduleRegisterProps> = ({ refetchSchedules }) => {
  const chouseisanPlaceholder = "https://chouseisan.com/s?h=0123456789abcdef0123456789abcdef";
  const [chouseisanLink, setChouseisanLink] = useState("");
  const [schedule, setSchedule] = useState<ScheduleMaster | null>(null);

  const { syncChouseisan } = useSchedule();

  const syncChouseisanHandler = (chouseisanLink: string) => {
    const { data: chouseisanId, success } = chouseisanIdSchema.safeParse(chouseisanLink);
    if (!success) {
      alert("リンクが無効です。");
      return;
    }
    syncChouseisan
      .trigger({ data: { chouseisan_id: chouseisanId } })
      .then((data) => {
        console.log(data);
        setSchedule(data);
        refetchSchedules();
      })
      .catch((error) => {
        console.error(error);
        alert("調整さんおデータ取得に失敗しました。");
      });
  };

  return (
    <div className="flex w-full flex-col items-center space-y-4 px-4">
      <div>調整さんのリンクを入力し、メンバーのスケジュールを同期します。</div>
      <InputWithButton
        value={chouseisanLink}
        onChange={(v) => setChouseisanLink(v)}
        onClick={syncChouseisanHandler}
        buttonIcon={<MdSync size={24} color="gray" />}
        placeholder={chouseisanPlaceholder}
      />
      {schedule && (
        <div className="flex w-full flex-col justify-start space-y-2">
          <div>同期が完了しました。</div>
          <details className="flex flex-col justify-start space-y-2">
            <summary>
              <span className="px-2">概要</span>
            </summary>
            <div className="flex items-center justify-start">
              <div className="w-20 shrink-0 text-slate-500">タイトル</div>
              <div>{schedule.title}</div>
            </div>
            <div className="flex items-center justify-start">
              <div className="w-20 shrink-0 text-slate-500">候補日</div>
              <div className="grow break-words">
                {schedule.candidates.map(({ date }) => date.format("M/D")).join(", ")}
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default ScheduleRegister;
