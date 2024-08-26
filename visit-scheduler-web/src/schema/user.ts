import { z } from "zod";

import { dateSchema, datetimeSchema } from "@/lib/datetime";
import { naturalNumberSchema } from "@/schema/common";
import { driverLevelSchema, genderSchema, scheduleStatusSchema, userRoleSchema } from "@/schema/enum";
import { appUserIdSchema, taskIdSchema, visitUserIdSchema } from "@/schema/id";

////////////////////// AppUser ////////////////////////

export const appUserBaseSchema = z.object({
  user_name: z.string(),
  display_name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
});

export type AppUserBase = z.infer<typeof appUserBaseSchema>;

export const appUserSchema = appUserBaseSchema.extend({
  id: appUserIdSchema,
  created_at: datetimeSchema,
});

export type AppUser = z.infer<typeof appUserSchema>;

////////////////////// Visit User ////////////////////////

export const visitUserSchema = z.object({
  id: visitUserIdSchema,
  name: z.string(),
  last_visit: datetimeSchema,
  entry_cohort: naturalNumberSchema,
  gender: genderSchema,
  driver_level: driverLevelSchema,
  responsible_tasks: z.array(taskIdSchema),
  app_user_id: appUserIdSchema
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  created_at: datetimeSchema,
});

export type VisitUser = z.infer<typeof visitUserSchema>;

export const VisitUserScheduleSchema = z.object({
  candidate: dateSchema,
  status: scheduleStatusSchema,
});

export type VisitUserSchedule = z.infer<typeof VisitUserScheduleSchema>;

export const visitUserWithScheduleSchema = visitUserSchema.extend({
  schedules: z.array(VisitUserScheduleSchema),
});

export type VisitUserWithSchedule = z.infer<typeof visitUserWithScheduleSchema>;

////////////////////// Sync Visit User Result ////////////////////////

export const syncVisitUserResultSchema = z.object({
  added: z.number(),
  updated: z.number(),
});

export type SyncVisitUserResult = z.infer<typeof syncVisitUserResultSchema>;
