import { z } from "zod";

export const naturalNumberSchema = z.number().int().positive();
