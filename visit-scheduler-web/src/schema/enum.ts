import { z } from "zod";

//////////////////////// User Role ////////////////////////

export const userRoleArr = ["dev", "admin", "user"] as const;

export const userRoleSchema = z.enum(userRoleArr);

export type UserRole = z.infer<typeof userRoleSchema>;

//////////////////////// Driver Level ////////////////////////

export const driverLevelArr = ["unable", "beginner", "intermediate", "advanced"] as const;

/**
 * 運転レベル
 * @property unable - 運転不可
 * @property beginner - 初心者
 * @property intermediate - 独り立ち
 * @property advanced - 独りでも安心
 */
export const driverLevelSchema = z.enum(driverLevelArr);

export type DriverLevel = z.infer<typeof driverLevelSchema>;

//////////////////////// Gender ////////////////////////

export const genderSchema = z.enum(["female", "male", "other"]);

export type Gender = z.infer<typeof genderSchema>;

//////////////////////// Schedule Status ////////////////////////

export const scheduleStatusArr = ["preferred", "available", "unavailable"] as const;

/**
 * スケジュールステータス
 * @property preferred - 希望 (○)
 * @property available - 可 (△)
 * @property unavailable - 不可 (×)
 */
export const scheduleStatusSchema = z.enum(scheduleStatusArr);

export type ScheduleStatus = z.infer<typeof scheduleStatusSchema>;
