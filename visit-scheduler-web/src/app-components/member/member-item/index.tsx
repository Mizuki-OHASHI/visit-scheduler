import { FC } from "react";

import TaskTag from "@/components/tag/task";
import { driverLevelJa, genderJa } from "@/schema/enum";
import { VisitUser } from "@/schema/user";

type MemberItemProps = {
  visitUser: VisitUser;
};

const MemberItem: FC<MemberItemProps> = ({ visitUser }) => {
  const { name, last_visit, entry_cohort, gender, driver_level, responsible_tasks } = visitUser;

  return (
    <div className="flex min-h-8 w-full items-center space-x-2 border-b border-slate-700 px-4 py-1 text-center">
      <div className="w-1/6 shrink-0">{name}</div>
      <div className="w-1/6 shrink-0">{last_visit.format("YY/M/D")}</div>
      <div className="w-1/12 shrink-0">{entry_cohort}期</div>
      <div className="w-1/12 shrink-0">{genderJa(gender)}</div>
      <div className="w-1/6 shrink-0">{driverLevelJa(driver_level)}</div>
      <div className="flex grow flex-wrap">
        {responsible_tasks.map((task) => (
          <TaskTag key={task} task={task} />
        ))}
      </div>
    </div>
  );
};

export default MemberItem;
