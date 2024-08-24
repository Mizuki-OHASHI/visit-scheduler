import { FC } from "react";
import { useRecoilValue } from "recoil";

import { getUserFromContext, userContextAtom } from "@/config/recoil";

const Header: FC = () => {
  const userCtx = useRecoilValue(userContextAtom);
  const user = getUserFromContext(userCtx);

  return (
    <div className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-950 px-8 text-white">
      <div className="text-2xl">Visit Scheduler</div>
      <p className="font-mono">alpha version</p>
      <div>{user?.display_name}</div>
    </div>
  );
};

export default Header;
