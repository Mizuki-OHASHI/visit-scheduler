import { useFetch, useMutation } from "@/api/useApi";
import { SpreadsheetId } from "@/schema/id";
import { SyncVisitUserResult, syncVisitUserResultSchema, VisitUser, visitUserSchema } from "@/schema/user";

export const useMember = () => ({
  syncSpreadsheetMember: useMutation<{ spreadsheet_id: SpreadsheetId }, SyncVisitUserResult>(
    ["member", "spreadsheet"],
    {
      schema: syncVisitUserResultSchema,
      inQuery: true,
    },
  ),
  fetchAllMembers: useFetch<VisitUser[]>(["member"], visitUserSchema.array()),
});
