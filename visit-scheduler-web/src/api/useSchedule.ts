import { useFetch, useMutation } from "@/api/useApi";
import { ChouseisanId } from "@/schema/id";
import {
  OptimizationResult,
  optimizationResultSchema,
  OptimizeConfig,
  ScheduleMaster,
  scheduleMasterSchema,
  ScheduleWithConfig,
  scheduleWithConfigSchema,
  SyncChouseisanResult,
  syncChouseisanResultSchema,
} from "@/schema/schedule";

export const useManySchedules = () => ({
  syncChouseisan: useMutation<Pick<ScheduleMaster, "chouseisan_id">, SyncChouseisanResult>(["schedule", "chouseisan"], {
    schema: syncChouseisanResultSchema,
    inQuery: true,
  }),
  fetchAllSchedule: useFetch<ScheduleMaster[]>(["schedule", "list"], scheduleMasterSchema.array()),
});

export const useSchedule = (chouseisanId: ChouseisanId) => ({
  fetchSchedule: useFetch<ScheduleWithConfig>(["schedule", chouseisanId], scheduleWithConfigSchema),
  upsertScheduleConfig: useMutation<OptimizeConfig>(["schedule", "config", chouseisanId], {}),
  optimizeSchedule: useMutation<Record<string, never>, OptimizationResult>(["schedule", "optimize", chouseisanId], {
    schema: optimizationResultSchema,
  }),
});
