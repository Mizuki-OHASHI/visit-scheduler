import { FC, ReactNode } from "react";

import { ConstraintsByCandidate, PickedDateWithMembers } from "@/schema/schedule";

type CandidateAreaProps = {
  optCandidate: PickedDateWithMembers;
  consCandidate: ConstraintsByCandidate;
  children: ReactNode;
};

const CandidateArea: FC<CandidateAreaProps> = ({ consCandidate, children }) => {
  const { candidate: date, group, tasks, irregular_member_count_constraint: member_count } = consCandidate;
  return (
    <div className="flex w-full items-center space-x-2 border-b border-slate-700 px-4 py-1">
      <div className="w-20 shrink-0">{date.format("M/D")}</div>
      <div className="flex grow flex-wrap">{children}</div>
    </div>
  );
};

export default CandidateArea;
