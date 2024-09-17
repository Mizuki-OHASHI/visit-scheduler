import { FC, useEffect, useMemo, useState } from "react";
import { FaTrash } from "react-icons/fa";

import { useManySchedules, useSchedule } from "@/api/useSchedule";
import BasicButton from "@/components/button/basic-button";
import IconButton from "@/components/button/icon-button";
import BasicSelect from "@/components/select/basic-select";
import { arrayToRecord } from "@/lib/array";
import { ChouseisanId } from "@/schema/id";
import { ScheduleMaster } from "@/schema/schedule";

type MergeScheduleProps = {
  chouseisanId: ChouseisanId;
  scheduleMaster: ScheduleMaster;
  refetchSchedule: () => void;
};

const MergeSchedule: FC<MergeScheduleProps> = ({ chouseisanId, scheduleMaster, refetchSchedule }) => {
  const { mergeSchedule, unmergeSchedule } = useSchedule(chouseisanId);
  const { fetchAllSchedule } = useManySchedules();
  const [scheduleToMerge, setScheduleToMerge] = useState<ChouseisanId | null>(null);

  const mergeScheduleHandler = (merge_with: ChouseisanId | null) => () => {
    if (!merge_with) return;
    mergeSchedule
      .trigger({ data: { merge_with } })
      .then(refetchSchedule)
      .catch((error) => {
        console.error(error);
        alert("スケジュールの統合に失敗しました。");
      });
  };

  const unmergeScheduleHandler = (merge_with: ChouseisanId) => () => {
    if (!confirm("本当に統合を解除しますか？")) return;
    unmergeSchedule
      .trigger({ data: { merge_with } })
      .then(refetchSchedule)
      .catch((error) => {
        console.error(error);
        alert("スケジュールの統合の削除に失敗しました。");
      });
  };

  const scheduleRecord = useMemo(
    () => arrayToRecord(fetchAllSchedule.data ?? [], ({ chouseisan_id }) => chouseisan_id),
    [fetchAllSchedule.data],
  );

  useEffect(() => {
    setScheduleToMerge(null);
  }, [scheduleMaster]);

  if (!fetchAllSchedule.data) return null;

  return (
    <div className="flex w-full flex-col items-center space-y-4 px-4">
      <ul className="list-disc break-words px-8 py-2">
        <li>他の調整さんの日程調整を統合することができます。</li>
        <li>基となる調整さんの候補日について、他の調整さんに回答したメンバーの日程を追加します。</li>
        <li>名前が被った場合は、基となる調整さんが優先されます。</li>
        <li>
          基となる調整さんにあって、統合する他の調整さんにはない候補日があった場合、統合する他の調整さんに回答したメンバーは、その候補日は「×」と回答したものとして扱います。
        </li>
        <li>
          逆に、統合する他の調整さんにあって、基となる調整さんにはない候補日があった場合、その候補日は無視されます。
          すなわち、他の調整さんを統合することによって、候補日を追加することは現行の仕様ではできません。
        </li>
      </ul>
      <div className="flex w-full space-x-4">
        <div className="h-12 grow">
          <BasicSelect<ChouseisanId>
            options={fetchAllSchedule.data
              .filter((s) => s.chouseisan_id !== chouseisanId && !scheduleMaster.merge_with.includes(s.chouseisan_id))
              .map(({ chouseisan_id }) => chouseisan_id)}
            onChange={setScheduleToMerge}
            value={scheduleToMerge}
            keyToLabel={(k) =>
              `${scheduleRecord[k].title} (${scheduleRecord[k].candidates[0].format("M/D")} ~ ${scheduleRecord[
                k
              ].candidates[scheduleRecord[k].candidates.length - 1].format("M/D")})`
            }
          />
        </div>
        <div className="h-12 w-20 shrink-0 text-center">
          <BasicButton onClick={mergeScheduleHandler(scheduleToMerge)} disabled={!scheduleToMerge}>
            統合
          </BasicButton>
        </div>
      </div>
      {scheduleMaster.merge_with.length > 0 && (
        <div className="flex w-full flex-col space-y-2 px-4">
          <div>統合済みの調整さん</div>
          {scheduleMaster.merge_with.map((merge_with) => (
            <div
              key={merge_with}
              className="flex h-8 w-full items-center justify-between  space-x-4 border-b border-slate-700 text-sm"
            >
              <div>{scheduleRecord[merge_with].title}</div>
              <div>
                {scheduleRecord[merge_with].candidates[0].format("M/D")} ~{" "}
                {scheduleRecord[merge_with].candidates[scheduleRecord[merge_with].candidates.length - 1].format("M/D")}
              </div>
              <IconButton onClick={unmergeScheduleHandler(merge_with)} size="sm">
                <FaTrash color="gray" size={12} />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MergeSchedule;
