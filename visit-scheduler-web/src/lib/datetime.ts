import dayjs, { Dayjs, extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import { z } from "zod";

extend(utc);

////////////////////// Datetime ////////////////////////

export const datetimeSchema = z
  .instanceof(dayjs as unknown as typeof Dayjs)
  .or(z.coerce.date().transform((value) => dayjs(value)))
  .brand("datetime");

export type Datetime = z.infer<typeof datetimeSchema>;

export type DatetimeInput = z.input<typeof datetimeSchema>;

export const newDatetime = (v: DatetimeInput): Datetime => datetimeSchema.parse(v);

////////////////////// Date ////////////////////////
export const dateSchema = z
  .instanceof(dayjs as unknown as typeof Dayjs)
  .or(z.coerce.date())
  .transform((value) => dayjs.utc(value).startOf("day"))
  .brand("date");

export type Date = z.infer<typeof dateSchema>;

export type DateInput = z.input<typeof dateSchema>;

export const newDate = (v: DateInput): Date => dateSchema.parse(v);
