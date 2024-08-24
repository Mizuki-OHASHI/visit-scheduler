import { z } from "zod";

export const naturalNumberSchema = z.number().int().positive();

export const commonSchema = z.object({
  task_list: z.array(z.string()),
});

export type Common = z.infer<typeof commonSchema>;
