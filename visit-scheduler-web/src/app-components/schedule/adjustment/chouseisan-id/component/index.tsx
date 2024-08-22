import { FC, useMemo } from "react";

import ScheduleOptimizeConfig from "#/schedule/adjustment/chouseisan-id/component/optimize-config";
import { useSchedule } from "@/api/useSchedule";
import { ChouseisanId } from "@/schema/id";
import { OptimizeConfig, optimizeConfigSchema } from "@/schema/schedule";

const ScheduleAdjustmentChouseisanIdComponent: FC<{ chouseisanId: ChouseisanId }> = ({ chouseisanId }) => {
  const { fetchSchedule, upsertScheduleConfig } = useSchedule(chouseisanId);
  const schedule = useMemo(() => {
    const data = fetchSchedule.data;
    if (!data) return null;

    const { schedule_master, optimize_config } = data;

    const defaultConfig = optimizeConfigSchema.parse({
      chouseisan_id: chouseisanId,
      entry_cohort_constraint: [],
      driver_level_constraint: 3,
      basic_member_count_constraint: 7,
      irregular_member_count_constraint: {},
      gender_consideration: [],
      candidate_constraints: schedule_master.candidates.map((candidate) => ({
        candidate,
        tasks: [],
        group: null,
        irregular_member_count_constraint: null,
      })),
    });

    return {
      schedule_master,
      config: optimize_config ?? defaultConfig,
    };
  }, [fetchSchedule.data]);

  const onSubmit = (config: OptimizeConfig) => {
    upsertScheduleConfig
      .trigger({ data: config })
      .then(() => {
        fetchSchedule.refetch();
        alert("条件を保存しました。");
      })
      .catch((error) => {
        console.error(error);
        alert("条件の保存に失敗しました。");
      });
  };

  if (!schedule) return null;

  return (
    <div className="flex size-full flex-col items-center space-y-4 p-8 lg:w-3/4">
      <details className="flex w-full flex-col items-center space-y-4" open>
        <summary className="text-2xl">
          <span className="px-4">最適化の条件を設定する</span>
        </summary>
        <ScheduleOptimizeConfig config={schedule.config} onSubmit={onSubmit} />
      </details>
    </div>
  );
};

export default ScheduleAdjustmentChouseisanIdComponent;
