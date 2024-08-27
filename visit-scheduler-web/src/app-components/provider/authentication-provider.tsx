"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";

import { useMe } from "@/api/useMe";
import { fireAuth } from "@/config/firebase";
import { userContextAtom } from "@/config/recoil";

const VSAuthNProvider = ({ children }: { children: ReactNode }) => {
  const [userCtx, setUserCtx] = useRecoilState(userContextAtom);
  const [googleAccount, setGoogleAccount] = useState<User | null>(null);
  const resetUserCtx = useResetRecoilState(userContextAtom);
  const me = useMe();
  const pathname = usePathname();

  useEffect(
    () =>
      onAuthStateChanged(fireAuth, (user) => {
        setGoogleAccount(user);
      }),
    [],
  );

  useEffect(() => {
    if (pathname === "/auth/signup") {
      if (!userCtx?.fetchMe.data && !userCtx?.fetchMe.error) {
        me.fetchMe.trigger().then((data) =>
          setUserCtx({
            ...me,
            fetchMe: { ...me.fetchMe, data },
          }),
        );
        return;
      }
    }
    const googleAccount = fireAuth.currentUser;
    if (googleAccount === null) {
      resetUserCtx();
      return;
    }
    if (googleAccount) {
      if (!userCtx?.fetchMe.data)
        me.fetchMe.trigger().then((data) =>
          setUserCtx({
            ...me,
            fetchMe: { ...me.fetchMe, data },
          }),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleAccount]);

  const isAuth = useMemo(() => userCtx?.fetchMe.data || pathname.startsWith("/auth"), [userCtx, pathname]);

  return (
    <>
      {isAuth ? (
        <>{children}</>
      ) : (
        <div className="flex h-screen w-screen items-center justify-center">
          <Link href="/auth/login" className="underline">
            ログイン
          </Link>
        </div>
      )}
    </>
  );
};

export default VSAuthNProvider;
