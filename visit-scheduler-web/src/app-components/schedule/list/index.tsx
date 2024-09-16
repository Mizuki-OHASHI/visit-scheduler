import { FC, useMemo } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { TbAdjustments } from "react-icons/tb";

import ScheduleListItem from "#/schedule/list/list-item";
import ScheduleRegister from "#/schedule/list/register";
import { useManySchedules } from "@/api/useSchedule";

const ScheduleListPage: FC = () => {
  const { fetchAllSchedule } = useManySchedules();
  const schedules = useMemo(() => fetchAllSchedule.data?.slice() ?? [], [fetchAllSchedule.data]);

  return (
    <div className="flex size-full flex-col items-center p-8 lg:w-3/4">
      <details className="flex w-full flex-col items-center space-y-4" open>
        <summary className="text-2xl">
          <span className="px-4">スケジュールを登録する</span>
        </summary>
        <ScheduleRegister refetchSchedules={() => fetchAllSchedule.refetch()} />
      </details>
      <div className="mb-8 mt-12 text-2xl">【 スケジュール一覧 】</div>
      <div className="flex w-full flex-col space-y-4">
        {schedules.map((schedule) => (
          <ScheduleListItem key={schedule.chouseisan_id} schedule={schedule} />
        ))}
      </div>
      <div className="flex w-full flex-wrap items-center justify-end pb-16 pt-4 text-sm text-slate-500">
        <div className="flex items-center space-x-2 px-2">
          <TbAdjustments size={20} />
          <div>スケジュールを調整する</div>
        </div>
        <div className="flex items-center space-x-2 px-2">
          <HiOutlineExternalLink size={20} />
          <div>調整さんを開く</div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleListPage;
