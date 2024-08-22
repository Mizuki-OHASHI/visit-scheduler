import { FC } from "react";

import ScheduleListItem from "#/schedule/list/list-item";
import ScheduleRegister from "#/schedule/list/register";
import { ScheduleMaster, scheduleMasterSchema } from "@/schema/schedule";

const ScheduleListPage: FC = () => {
  const schedules: ScheduleMaster[] = scheduleMasterSchema.array().parse([
    {
      chouseisan_id: "c6c6239d313e4ce0ae4dd2425dca1a32",
      title: "タイトル",
      candidates: [
        { date: new Date("2022-01-01"), group: null },
        { date: new Date("2022-01-02"), group: null },
        { date: new Date("2022-01-03"), group: null },
      ],
    },
    {
      chouseisan_id: "c6c6239d313e4ce0ae4dd2425dca1a33",
      title: "タイトル",
      candidates: [
        { date: new Date("2022-06-05"), group: null },
        { date: new Date("2022-06-02"), group: null },
        { date: new Date("2022-06-03"), group: null },
      ],
    },
    {
      chouseisan_id: "c6c6239d313e4ce0ae4dd2425dca1a34",
      title: "タイトル",
      candidates: [
        { date: new Date("2022-09-01"), group: null },
        { date: new Date("2022-09-02"), group: null },
        { date: new Date("2022-08-03"), group: null },
      ],
    },
  ]);

  return (
    <div className="flex size-full flex-col items-center p-8 lg:w-3/4">
      <details className="flex w-full flex-col items-center space-y-4" open>
        <summary className="text-2xl">
          <span className="px-4">新しいスケジュールを登録する</span>
        </summary>
        <ScheduleRegister />
      </details>
      <div className="mb-8 mt-12 text-2xl">【 スケジュール一覧 】</div>
      <div className="flex w-full flex-col space-y-4">
        {schedules.map((schedule) => (
          <ScheduleListItem key={schedule.chouseisan_id} onClick={() => {}} schedule={schedule} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleListPage;
