import { z } from "zod";

export const idSchema = z.string().refine((v) => v.length > 0, { message: "empty string is not allowed" });

////////////////////// User ////////////////////////

export const appUserIdSchema = idSchema.brand("app_user_id");

export type AppUserId = z.infer<typeof appUserIdSchema>;

export const visitUserIdSchema = idSchema.brand("visit_user_id");

export type VisitUserId = z.infer<typeof visitUserIdSchema>;

////////////////////// VisitSchedule ////////////////////////

export const taskIdSchema = idSchema.brand("task_id");

export type TaskId = z.infer<typeof taskIdSchema>;

export const visitScheduleIdSchema = idSchema.brand("visit_schedule_id");

export type VisitScheduleId = z.infer<typeof visitScheduleIdSchema>;

////////////////////// Candidate Group ////////////////////////

export const scheduleGroupIdSchema = idSchema.brand("schedule_group_id");

export type ScheduleGroupId = z.infer<typeof scheduleGroupIdSchema>;

////////////////////// Chouseisan ////////////////////////

/**
 * 調整さんのID
 * @example https://chouseisan.com/s?h=6bad9422daac4beda8cfad35583db3a0
 */
export const chouseisanIdSchema = z
  .string()
  .regex(/^https:\/\/chouseisan\.com\/s\?h=[0-9a-f]{32}$/)
  .transform((v) => v.slice(27))
  .or(z.string().regex(/^[0-9a-f]{32}$/))
  .brand("chouseisan_id");

export type ChouseisanId = z.infer<typeof chouseisanIdSchema>;
