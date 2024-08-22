import { useMutation } from "@/api/useApi";
import { ScheduleMaster, scheduleMasterSchema } from "@/schema/schedule";

export const useSchedule = () => ({
  syncChouseisan: useMutation<Pick<ScheduleMaster, "chouseisan_id">, ScheduleMaster>(["schedule", "chouseisan"], {
    schema: scheduleMasterSchema,
    inQuery: true,
  }),
});
