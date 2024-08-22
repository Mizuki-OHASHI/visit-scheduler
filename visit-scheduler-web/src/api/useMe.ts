import { useMutation, useDeferredFetch } from "@/api/useApi";
import { AppUser, AppUserBase, appUserSchema } from "@/schema/user";

export const useMe = () => ({
  fetchMe: useDeferredFetch<AppUser>(["me"], appUserSchema),
  createMe: useMutation<AppUserBase>(["me"], {}),
});
