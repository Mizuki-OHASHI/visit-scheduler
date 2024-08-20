import { z } from "zod";

import { datetimeSchema } from "@/lib/datetime";
import { taskIdSchema, visitScheduleIdSchema, visitUserIdSchema } from "@/schema/id";

////////////////////// Task ////////////////////////

export const taskSchema = z.object({
  id: taskIdSchema,
  name: z.string(),
  created_at: datetimeSchema,
});

export type Task = z.infer<typeof taskSchema>;

////////////////////// VisitSchedule ////////////////////////

export const visitScheduleBaseSchema = z.object({
  id: visitScheduleIdSchema,
  date: datetimeSchema,
  tasks: z.array(taskIdSchema),
});

export type VisitScheduleBase = z.infer<typeof visitScheduleBaseSchema>;

export const canceledVisitScheduleSchema = visitScheduleBaseSchema.extend({
  picked: z.literal(false),
});

export type CanceledVisitSchedule = z.infer<typeof canceledVisitScheduleSchema>;

export const pickedVisitScheduleSchema = visitScheduleBaseSchema.extend({
  picked: z.literal(true),
  members: z.array(visitUserIdSchema),
});

export type PickedVisitSchedule = z.infer<typeof pickedVisitScheduleSchema>;

export const visitScheduleSchema = z.union([canceledVisitScheduleSchema, pickedVisitScheduleSchema]);

export type VisitSchedule = z.infer<typeof visitScheduleSchema>;

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
