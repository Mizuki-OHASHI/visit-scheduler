import { atom, RecoilEnv } from "recoil";

import { useMe } from "@/api/useMe";
import { AppUser } from "@/schema/user";

/**
 * @description
 */
export type UserContext = ReturnType<typeof useMe> | null;

export const userContextAtom = atom<UserContext>({
  key: "userCtx",
  default: undefined,
});

// NOTE:
// Fast Refresh が有効な場合、Recoil は同じキーで複数のアトムを登録しようとすると警告を出すが、その警告を無視する。
// エラーの内容は以下の通り。
//   Expectation Violation: Duplicate atom key "userCtx". This is a FATAL ERROR in production.
//   But it is safe to ignore this warning if it occurred because of hot module replacement.
if (process.env.NODE_ENV === "development") RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export const getUserFromContext = (userCtx: UserContext): AppUser | null => userCtx?.fetchMe.data ?? null;
