"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useRecoilValue } from "recoil";

import { AUTHORIZED_ROUTES } from "@/config/auth";
import { getUserFromContext, userContextAtom } from "@/config/recoil";

const VSAuthZProvider = ({ children }: { children: ReactNode }) => {
  const userCtx = useRecoilValue(userContextAtom);
  const user = getUserFromContext(userCtx);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const role = user?.role;

    if (path.startsWith("/auth")) {
      if (user) {
        router.push("/");
        return;
      } else if (userCtx?.fetchMe.error && path === "/auth/login") {
        router.push("/auth/signup");
        return;
      }
      return;
    }

    switch (role) {
      case "user":
        if (!AUTHORIZED_ROUTES.user.some((route) => path.startsWith(route))) router.replace("/");
        break;
      case "admin":
        if (
          !AUTHORIZED_ROUTES.admin.some((route) => path.startsWith(route)) &&
          !AUTHORIZED_ROUTES.user.some((route) => path.startsWith(route))
        )
          router.replace("/");
        break;
      case "dev":
        break;
      default:
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCtx, user, path]);

  return <>{children}</>;
};

export default VSAuthZProvider;
