import { useFetch, useMutation } from "@/api/useApi";
import {
  ScheduleMaster,
  scheduleMasterSchema,
  SyncChouseisanResult,
  syncChouseisanResultSchema,
} from "@/schema/schedule";

export const useSchedule = () => ({
  syncChouseisan: useMutation<Pick<ScheduleMaster, "chouseisan_id">, SyncChouseisanResult>(["schedule", "chouseisan"], {
    schema: syncChouseisanResultSchema,
    inQuery: true,
  }),
  fetchAllSchedule: useFetch<ScheduleMaster[]>(["schedule", "list"], scheduleMasterSchema.array()),
});
