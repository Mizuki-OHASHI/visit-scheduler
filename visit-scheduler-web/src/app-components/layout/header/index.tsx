import { FC } from "react";

const Header: FC = () => {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-700 bg-slate-950 px-8 text-white">
      <div className="text-2xl">Visit Scheduler</div>
      <div>ctx.user_name</div>
    </div>
  );
};

export default Header;
