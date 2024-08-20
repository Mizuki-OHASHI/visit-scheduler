import { z } from "zod";

import { datetimeSchema } from "@/lib/datetime";
import { naturalNumberSchema } from "@/schema/common";
import { driverLevelSchema, genderSchema, scheduleStatusSchema, userRoleSchema } from "@/schema/enum";
import { appUserIdSchema, taskIdSchema, visitScheduleIdSchema, visitUserIdSchema } from "@/schema/id";

////////////////////// AppUser ////////////////////////

export const appUserSchema = z.object({
  id: appUserIdSchema,
  user_name: z.string(),
  display_name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  created_at: datetimeSchema,
});

export type AppUser = z.infer<typeof appUserSchema>;

////////////////////// VisitUser ////////////////////////

export const visitUserProfileSchema = z.object({
  name: z.string(),
  last_visit: datetimeSchema,
  entry_cohort: naturalNumberSchema, // n期生
  gender: genderSchema,
  driver_level: driverLevelSchema,
  responsible_tasks: z.array(taskIdSchema),
});

export type VisitUserProfile = z.infer<typeof visitUserProfileSchema>;

export const visitUserScheduleSchema = z.object({
  schedule_id: visitScheduleIdSchema,
  status: scheduleStatusSchema,
  remarks: z.string().optional(),
});

export type VisitUserSchedule = z.infer<typeof visitUserScheduleSchema>;

export const visitUserSchema = z.object({
  id: visitUserIdSchema,
  profile: visitUserProfileSchema,
  schedules: z.array(visitUserScheduleSchema),
  created_at: datetimeSchema,
  app_user_id: appUserIdSchema.optional(),
});

export type VisitUser = z.infer<typeof visitUserSchema>;
