import { FC, useEffect, useState } from "react";
import { MdSync } from "react-icons/md";

import { useSchedule } from "@/api/useSchedule";
import InputWithButton from "@/components/input/input-with-button";
import { ChouseisanId, chouseisanIdSchema } from "@/schema/id";
import { ScheduleMaster } from "@/schema/schedule";

type ScheduleRegisterProps = Record<string, never>;

const ScheduleRegister: FC<ScheduleRegisterProps> = () => {
  const chouseisanPlaceholder = "https://chouseisan.com/s?h=0123456789abcdef0123456789abcdef";
  const [chouseisanLink, setChouseisanLink] = useState("https://chouseisan.com/s?h=c6c6239d313e4ce0ae4dd2425dca1a32");
  const [chouseisanId, setChouseisanId] = useState<ChouseisanId | null>(null);
  const [schedule, setSchedule] = useState<ScheduleMaster | null>(null);

  const { syncChouseisan } = useSchedule();

  useEffect(() => {
    if (chouseisanId) {
      syncChouseisan
        .trigger({ data: { chouseisan_id: chouseisanId } })
        .then((data) => {
          console.log(data);
          setSchedule(data);
        })
        .catch((error) => {
          console.error(error);
          alert("調整さんのデータ取得に失敗しました。");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chouseisanId]);

  return (
    <div className="flex w-full flex-col items-center space-y-4 px-4">
      <div>調整さんのリンクを入力し、メンバーのスケジュールを同期します。</div>
      <InputWithButton
        value={chouseisanLink}
        onChange={(v) => setChouseisanLink(v)}
        onClick={(v) => setChouseisanId(chouseisanIdSchema.parse(v))}
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
