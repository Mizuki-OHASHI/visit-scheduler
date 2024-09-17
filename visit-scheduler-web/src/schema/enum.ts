import { z } from "zod";

//////////////////////// User Role ////////////////////////

export const userRoleArr = ["dev", "admin", "user"] as const;

export const userRoleSchema = z.enum(userRoleArr);

export type UserRole = z.infer<typeof userRoleSchema>;

export const userRoleJa = (r: UserRole) => {
  switch (r) {
    case "dev":
      return "開発者";
    case "admin":
      return "管理者";
    case "user":
      return "ユーザー";
    default:
      return "-";
  }
};

//////////////////////// Driver Level ////////////////////////

export const driverLevelArr = ["unable", "beginner", "intermediate", "advanced"] as const;

/**
 * 運転レベル
 * @property unable - 運転不可
 * @property beginner - 初心者
 * @property intermediate - 独り立ち
 * @property advanced - 熟練
 */
export const driverLevelSchema = z.enum(driverLevelArr);

export type DriverLevel = z.infer<typeof driverLevelSchema>;

export const driverLevelJa = (l: DriverLevel) => {
  switch (l) {
    case "unable":
      return "不可";
    case "beginner":
      return "初心者";
    case "intermediate":
      return "独り立ち";
    case "advanced":
      return "熟練";
    default:
      return "-";
  }
};

//////////////////////// Gender ////////////////////////

export const genderArr = ["female", "male", "other"] as const;

export const genderSchema = z.enum(genderArr);

export type Gender = z.infer<typeof genderSchema>;

export const genderJa = (g: Gender) => {
  switch (g) {
    case "female":
      return "女";
    case "male":
      return "男";
    default:
      return "-";
  }
};

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

export const scheduleStatusJa = (s: ScheduleStatus) => {
  switch (s) {
    case "preferred":
      return "○";
    case "available":
      return "△";
    case "unavailable":
      return "×";
    default:
      return "-";
  }
};

//////////////////////// Comparison Operator ////////////////////////

export const comparisonOperatorArr = ["==", "<=", ">="] as const;

export const comparisonOperatorSchema = z.enum(comparisonOperatorArr);

export type ComparisonOperator = z.infer<typeof comparisonOperatorSchema>;

export const comparisonOperatorJa = (o: ComparisonOperator) => {
  switch (o) {
    case "==":
      return "と等しい";
    case "<=":
      return "以下";
    case ">=":
      return "以上";
    default:
      return "-";
  }
};

//////////////////////// Optimization Status ////////////////////////

export const optimizationStatusArr = ["optimal", "infeasible", "failed"] as const;

/**
 * 最適化ステータス
 * @property optimal - 最適解
 * @property infeasible - 解なし
 * @property failed - 失敗
 */
export const optimizationStatusSchema = z.enum(optimizationStatusArr);

export type OptimizationStatus = z.infer<typeof optimizationStatusSchema>;

export const optimizationStatusJa = (s: OptimizationStatus) => {
  switch (s) {
    case "optimal":
      return "最適解";
    case "infeasible":
      return "解なし";
    case "failed":
      return "失敗";
    default:
      return "-";
  }
};
