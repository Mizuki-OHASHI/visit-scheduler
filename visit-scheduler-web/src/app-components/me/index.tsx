import { useRecoilValue } from "recoil";

import { getUserFromContext, userContextAtom } from "@/config/recoil";
import { userRoleJa } from "@/schema/enum";

const MyPage = () => {
  const userCtx = useRecoilValue(userContextAtom);
  const user = getUserFromContext(userCtx);

  if (!user) return null;

  return (
    <div className="flex flex-col items-center space-y-4 p-8 pb-16 lg:w-3/4">
      <div className="flex w-full">
        <div className="w-1/3 shrink-0">ユーザー名</div>
        <div className="grow">{user.user_name}</div>
      </div>
      <div className="flex w-full">
        <div className="w-1/3 shrink-0">表示名</div>
        <div className="grow">{user.display_name}</div>
      </div>
      <div className="flex w-full">
        <div className="w-1/3 shrink-0">email</div>
        <div className="grow">{user.email}</div>
      </div>
      <div className="flex w-full">
        <div className="w-1/3 shrink-0">ロール</div>
        <div className="grow">{userRoleJa(user.role)}</div>
      </div>
      <div className="w-full py-4 text-sm text-slate-500">※ アカウント情報の編集機能は現在開発中です。</div>
    </div>
  );
};

export default MyPage;
