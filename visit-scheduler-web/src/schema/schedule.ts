import { z } from "zod";

import { dateSchema } from "@/lib/datetime";
import { naturalNumberSchema } from "@/schema/common";
import { comparisonOperatorSchema } from "@/schema/enum";
import { chouseisanIdSchema, scheduleGroupIdSchema, visitUserIdSchema } from "@/schema/id";

////////////////////// Schedule Group ////////////////////////

export const scheduleGroupSchema = z.object({
  id: scheduleGroupIdSchema,
  name: z.string(),
  tasks: z.array(z.string()),
  description: z.string().optional(),
});

export type ScheduleGroup = z.infer<typeof scheduleGroupSchema>;

////////////////////// Schedule Master ////////////////////////

export const scheduleMasterSchema = z.object({
  chouseisan_id: chouseisanIdSchema,
  title: z.string(),
  candidates: z.array(dateSchema),
  merge_with: z.array(chouseisanIdSchema),
});

export type ScheduleMaster = z.infer<typeof scheduleMasterSchema>;

////////////////////// Sync Chouseisan Result ////////////////////////

export const syncChouseisanResultSchema = z.object({
  schedule_master: scheduleMasterSchema,
  diff_visit_users: z.array(z.string()),
});

export type SyncChouseisanResult = z.infer<typeof syncChouseisanResultSchema>;

////////////////////// Optimize Config ////////////////////////

export const entryCohortConstraintSchema = z.array(
  z.tuple([z.array(naturalNumberSchema), comparisonOperatorSchema, naturalNumberSchema]),
);

export type EntryCohortConstraint = z.infer<typeof entryCohortConstraintSchema>;

export const constraintsByCandidateSchema = z.object({
  candidate: dateSchema,
  group: z
    .string()
    .nullable()
    .optional()
    .transform((r) => r ?? null),
  tasks: z.array(z.tuple([z.string(), z.number().int()])),
  irregular_member_count_constraint: naturalNumberSchema
    .nullable()
    .optional()
    .transform((r) => r ?? null),
});

export type ConstraintsByCandidate = z.infer<typeof constraintsByCandidateSchema>;

export const optimizeConfigSchema = z.object({
  chouseisan_id: chouseisanIdSchema,
  entry_cohort_constraint: entryCohortConstraintSchema,
  driver_level_constraint: z.number().int().nonnegative(),
  basic_member_count_constraint: naturalNumberSchema,
  gender_consideration: z.array(naturalNumberSchema),
  candidate_constraints: z.array(constraintsByCandidateSchema),
});

export type OptimizeConfig = z.infer<typeof optimizeConfigSchema>;

////////////////////// Optimized Schedule ////////////////////////

export const pickedDateWithMembersSchema = z.object({
  date: dateSchema,
  member: z.array(visitUserIdSchema),
});

export type PickedDateWithMembers = z.infer<typeof pickedDateWithMembersSchema>;

export const optimizedScheduleSchema = z.object({
  chouseisan_id: chouseisanIdSchema,
  schedule: z.array(pickedDateWithMembersSchema),
});

export type OptimizedSchedule = z.infer<typeof optimizedScheduleSchema>;

////////////////////// Schedule With Config ////////////////////////

export const scheduleWithConfigSchema = z.object({
  schedule_master: scheduleMasterSchema,
  optimize_config: optimizeConfigSchema
    .optional()
    .nullable()
    .transform((r) => r ?? null),
  optimized_schedule: optimizedScheduleSchema
    .optional()
    .nullable()
    .transform((r) => r ?? null),
});

export type ScheduleWithConfig = z.infer<typeof scheduleWithConfigSchema>;

////////////////////// Optimization Result ////////////////////////

export const optimizationResultSchema = z
  .object({
    chouseisan_id: chouseisanIdSchema,
    status: z.literal("optimal"),
    optimized_schedule: optimizedScheduleSchema,
  })
  .or(
    z.object({
      chouseisan_id: chouseisanIdSchema,
      status: z.literal("infeasible").or(z.literal("failed")),
      optimized_schedule: z.null(),
    }),
  );

export type OptimizationResult = z.infer<typeof optimizationResultSchema>;
