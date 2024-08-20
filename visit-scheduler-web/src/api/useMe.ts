import { useFetch, useMutation } from "@/api/useApi";
import { AppUser, appUserSchema } from "@/schema/user";

export const useMe = () => ({
  fetchMe: useFetch<AppUser>(["me"], appUserSchema),
  createMe: useMutation<AppUser>(["me"], {}),
});
