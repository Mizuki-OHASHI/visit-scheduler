import { FC, useMemo } from "react";

import ScheduleListItem from "#/schedule/list/list-item";
import ScheduleRegister from "#/schedule/list/register";
import { useSchedule } from "@/api/useSchedule";

const ScheduleListPage: FC = () => {
  const { fetchAllSchedule } = useSchedule();
  const schedules = useMemo(() => fetchAllSchedule.data?.slice() ?? [], [fetchAllSchedule.data]);

  return (
    <div className="flex size-full flex-col items-center p-8 lg:w-3/4">
      <details className="flex w-full flex-col items-center space-y-4" open>
        <summary className="text-2xl">
          <span className="px-4">新しいスケジュールを登録する</span>
        </summary>
        <ScheduleRegister refetchSchedules={() => fetchAllSchedule.refetch()} />
      </details>
      <div className="mb-8 mt-12 text-2xl">【 スケジュール一覧 】</div>
      <div className="flex w-full flex-col space-y-4 pb-16">
        {schedules.map((schedule) => (
          <ScheduleListItem key={schedule.chouseisan_id} onClick={() => {}} schedule={schedule} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleListPage;
