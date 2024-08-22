import { useFetch, useMutation } from "@/api/useApi";
import { ScheduleMaster, scheduleMasterSchema } from "@/schema/schedule";

export const useSchedule = () => ({
  syncChouseisan: useMutation<Pick<ScheduleMaster, "chouseisan_id">, ScheduleMaster>(["schedule", "chouseisan"], {
    schema: scheduleMasterSchema,
    inQuery: true,
  }),
  fetchAllSchedule: useFetch<ScheduleMaster[]>(["schedule", "list"], scheduleMasterSchema.array()),
});
