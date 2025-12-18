import { FC, useMemo, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { TbAdjustments } from "react-icons/tb";

import ScheduleListItem from "#/schedule/list/list-item";
import ScheduleRegister from "#/schedule/list/register";
import { useManySchedules } from "@/api/useSchedule";

type SortKey = "title" | "period";

const ScheduleListPage: FC = () => {
  const { fetchAllSchedule } = useManySchedules();
  const [sortKey, setSortKey] = useState<SortKey>("period");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const schedules = useMemo(() => {
    const data = fetchAllSchedule.data?.slice() ?? [];
    return data.sort((a, b) => {
      if (sortKey === "title") {
        return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
      const aStart = Math.min(...a.candidates.map((c) => c.valueOf()));
      const bStart = Math.min(...b.candidates.map((c) => c.valueOf()));
      return sortAsc ? aStart - bStart : bStart - aStart;
    });
  }, [fetchAllSchedule.data, sortKey, sortAsc]);

  return (
    <div className="flex size-full flex-col items-center p-8 lg:w-3/4">
      <details className="flex w-full flex-col items-center space-y-4" open>
        <summary className="text-2xl">
          <span className="px-4">スケジュールを登録する</span>
        </summary>
        <ScheduleRegister refetchSchedules={() => fetchAllSchedule.refetch()} />
      </details>
      <div className="mb-8 mt-12 text-2xl">【 スケジュール一覧 】</div>
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center border-b border-slate-700 px-4 py-2 text-sm text-slate-400">
          <button onClick={() => handleSort("title")} className="flex grow items-center gap-1 hover:text-slate-200">
            <span>タイトル</span>
            {sortKey === "title" && (sortAsc ? <MdExpandMore size={16} /> : <MdExpandLess size={16} />)}
          </button>
          <button
            onClick={() => handleSort("period")}
            className="hidden w-32 items-center justify-center gap-1 hover:text-slate-200 sm:flex"
          >
            <span>期間</span>
            {sortKey === "period" && (sortAsc ? <MdExpandMore size={16} /> : <MdExpandLess size={16} />)}
          </button>
          <div className="w-20 text-center">操作</div>
        </div>
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
