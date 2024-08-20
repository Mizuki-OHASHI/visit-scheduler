import { z } from "zod";

export const errorResponseSchema = z.object({
  message: z.string(),
  detail: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
