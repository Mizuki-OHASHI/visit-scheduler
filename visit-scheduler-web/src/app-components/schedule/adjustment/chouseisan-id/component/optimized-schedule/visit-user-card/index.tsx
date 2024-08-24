import cn from "classnames";
import { FC } from "react";

import { VisitUser } from "@/schema/user";

type VisitUserCardProps = {
  visitUser: VisitUser;
};

const VisitUserCard: FC<VisitUserCardProps> = ({ visitUser }) => {
  return (
    <div
      className={cn("flex px-1 m-0.5 min-w-24 text-sm items-center rounded-xl bg-slate-700 justify-start", {
        "text-slate-900 bg-slate-500": visitUser.driver_level !== "unable",
      })}
    >
      <div className="flex size-4 items-center justify-center rounded-full bg-slate-900 text-xs text-slate-100">
        {visitUser.entry_cohort}
      </div>
      <div className="grow text-center">{visitUser.name}</div>
    </div>
  );
};

export default VisitUserCard;
