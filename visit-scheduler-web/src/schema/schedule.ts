import { z } from "zod";

import { dateSchema } from "@/lib/datetime";
import { chouseisanIdSchema, scheduleGroupIdSchema, taskIdSchema } from "@/schema/id";

////////////////////// Task ////////////////////////

export const taskSchema = z.object({
  id: taskIdSchema,
  name: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

////////////////////// Candidate ////////////////////////

export const candidateSchema = z.object({
  date: dateSchema,
  group: scheduleGroupIdSchema.nullable(),
});

export type Candidate = z.infer<typeof candidateSchema>;

////////////////////// Schedule Group ////////////////////////

export const scheduleGroupSchema = z.object({
  id: scheduleGroupIdSchema,
  name: z.string(),
  tasks: z.array(taskSchema),
  description: z.string().optional(),
});

export type ScheduleGroup = z.infer<typeof scheduleGroupSchema>;

////////////////////// Schedule Master ////////////////////////

export const scheduleMasterSchema = z.object({
  chouseisan_id: chouseisanIdSchema,
  title: z.string(),
  candidates: z.array(candidateSchema),
});

export type ScheduleMaster = z.infer<typeof scheduleMasterSchema>;

////////////////////// Sync Chouseisan Result ////////////////////////

export const syncChouseisanResultSchema = z.object({
  schedule_master: scheduleMasterSchema,
  diff_visit_users: z.array(z.string()),
});

export type SyncChouseisanResult = z.infer<typeof syncChouseisanResultSchema>;
