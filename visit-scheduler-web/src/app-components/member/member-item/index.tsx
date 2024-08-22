import { driverLevelJa, genderJa } from "@/schema/enum";
import { VisitUser } from "@/schema/user";
import { FC } from "react";

type MemberItemProps = {
  visitUser: VisitUser;
};

const MemberItem: FC<MemberItemProps> = ({ visitUser }) => {
  const { profile } = visitUser;
  const { name, last_visit, entry_cohort, gender, driver_level, responsible_tasks } = profile;

  return (
    <div className="w-full h-8 border-b border-slate-700 flex space-x-2 items-center px-4 text-center">
      <div className="w-1/6 shrink-0">{name}</div>
      <div className="w-1/6 shrink-0">{last_visit.format("YY/MM/DD")}</div>
      <div className="w-1/12 shrink-0">{entry_cohort}期</div>
      <div className="w-1/12 shrink-0">{genderJa(gender)}</div>
      <div className="w-1/12 shrink-0">{driverLevelJa(driver_level)}</div>
      <div className="flex flex-wrap grow">
        {responsible_tasks.map((task) => (
          <div key={task} className="h-6 px-2 text-xs py-1 rounded-full bg-slate-700 m-0.5">
            {task}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberItem;
