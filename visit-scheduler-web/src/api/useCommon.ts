import { useFetch, useMutation } from "@/api/useApi";
import { Common, commonSchema } from "@/schema/common";

export const useCommon = () => ({
  fetchCommon: useFetch<Common>(["common"], commonSchema),
  refreshCommon: useMutation(["common", "refresh"], {}),
});
