import { z } from "zod";

import { datetimeSchema } from "@/lib/datetime";
import { taskIdSchema, visitScheduleIdSchema, visitUserIdSchema } from "@/schema/id";

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
