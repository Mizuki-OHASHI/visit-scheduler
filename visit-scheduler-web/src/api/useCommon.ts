import { useFetch } from "@/api/useApi";
import { Common, commonSchema } from "@/schema/common";

export const useCommon = () => ({
  fetchCommon: useFetch<Common>(["common"], commonSchema),
});
