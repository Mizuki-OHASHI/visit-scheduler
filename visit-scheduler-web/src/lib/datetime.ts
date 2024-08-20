import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";

export const datetimeSchema = z
  .instanceof(dayjs as unknown as typeof Dayjs)
  .or(z.coerce.date().transform((value) => dayjs(value)))
  .brand("datetime");

export type Datetime = z.infer<typeof datetimeSchema>;

export type DatetimeInput = z.input<typeof datetimeSchema>;

export const newDatetime = (v: DatetimeInput): Datetime => datetimeSchema.parse(v);
