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
