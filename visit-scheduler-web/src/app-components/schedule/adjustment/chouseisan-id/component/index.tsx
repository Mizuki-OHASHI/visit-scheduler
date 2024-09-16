import { FC, useEffect, useMemo } from "react";

import ScheduleOptimizeConfig from "#/schedule/adjustment/chouseisan-id/component/optimize-config";
import { OptimizedScheduleComponent } from "#/schedule/adjustment/chouseisan-id/component/optimized-schedule";
import { useMember } from "@/api/useMember";
import { useSchedule } from "@/api/useSchedule";
import BasicButton from "@/components/button/basic-button";
import { ChouseisanId } from "@/schema/id";
import { OptimizeConfig, optimizeConfigSchema } from "@/schema/schedule";

const ScheduleAdjustmentChouseisanIdComponent: FC<{ chouseisanId: ChouseisanId }> = ({ chouseisanId }) => {
  const { fetchSchedule, upsertScheduleConfig, optimizeSchedule } = useSchedule(chouseisanId);
  const { fetchAllMembers } = useMember();

  useEffect(() => {
    fetchSchedule.trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chouseisanId]);

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
      optimized: data.optimized_schedule,
    };
  }, [chouseisanId, fetchSchedule.data]);

  const onSubmit = (config: OptimizeConfig) => {
    upsertScheduleConfig
      .trigger({ data: config })
      .then(() => {
        fetchSchedule.trigger();
        alert("条件を保存しました。");
      })
      .catch((error) => {
        console.error(error);
        alert("条件の保存に失敗しました。");
      });
  };

  const runOptimize = () => {
    optimizeSchedule
      .trigger()
      .then((result) => {
        if (result.status === "optimal") {
          fetchSchedule.trigger();
          alert("最適化を実行しました。");
        } else if (result.status === "infeasible") {
          alert("最適化が不可能です。条件を見直してください。");
        } else {
          alert(
            "最適化処理に失敗しました。お手数をおかけしますが、このページのURLと実行日時を添えて開発者にお問い合わせください。",
          );
        }
      })
      .catch((error) => {
        console.error(error);
        alert("最適化の実行に失敗しました。");
      });
  };

  if (!schedule) return null;

  return (
    <div className="flex size-full flex-col items-center space-y-4 p-8 pb-16 lg:w-3/4">
      <h1 className="p-4 text-3xl">{schedule.schedule_master.title}</h1>
      <details className="flex w-full flex-col items-center space-y-4" open>
        <summary className="text-2xl">
          <span className="px-4">最適化の条件を設定する</span>
        </summary>
        <ScheduleOptimizeConfig config={schedule.config} onSubmit={onSubmit} />
      </details>
      <div className="w-full pb-16">
        <div className="h-20 w-full p-4">
          <BasicButton onClick={runOptimize} disabled={!fetchSchedule.data?.optimize_config}>
            {fetchSchedule.data?.optimize_config ? "最適化を実行する" : "条件を設定した後に最適化を実行できます"}
          </BasicButton>
        </div>
      </div>
      <div className="w-full pb-16">
        {schedule.optimized && fetchAllMembers.data && (
          <OptimizedScheduleComponent
            optimizedSchedule={schedule.optimized}
            constraints={schedule.config.candidate_constraints}
            visitUsers={fetchAllMembers.data}
          />
        )}
      </div>
    </div>
  );
};

export default ScheduleAdjustmentChouseisanIdComponent;
