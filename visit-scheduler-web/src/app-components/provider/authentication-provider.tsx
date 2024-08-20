"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
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
    if (pathname === "/auth/signup") return;
    const googleAccount = fireAuth.currentUser;
    if (googleAccount === null) {
      resetUserCtx();
      return;
    }
    if (googleAccount) {
      if (!userCtx)
        me.fetchMe.refetch().then((data) =>
          setUserCtx({
            ...me,
            fetchMe: { ...me.fetchMe, data },
          }),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleAccount]);

  return (
    <>
      {userCtx || pathname.startsWith("/auth") ? (
        <>{children}</>
      ) : (
        <div>
          <div className="absolute bottom-1/3 z-10 w-screen text-center">
            <Link href="/login">ログイン</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default VSAuthNProvider;
