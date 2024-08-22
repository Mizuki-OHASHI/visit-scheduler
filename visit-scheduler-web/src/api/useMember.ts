import { useMutation } from "@/api/useApi";
import { SpreadsheetId } from "@/schema/id";
import { VisitUser, visitUserSchema } from "@/schema/user";

export const useMember = () => ({
  syncSpreadsheetMember: useMutation<{ spreadsheet_id: SpreadsheetId }, VisitUser[]>(["member", "spreadsheet"], {
    schema: visitUserSchema.array(),
    inQuery: true,
  }),
});
