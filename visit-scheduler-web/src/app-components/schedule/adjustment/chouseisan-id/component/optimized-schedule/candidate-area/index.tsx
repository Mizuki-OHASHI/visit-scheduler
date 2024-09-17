import { FC, ReactNode } from "react";
import { FaTrash } from "react-icons/fa";

import IconButton from "@/components/button/icon-button";
import { ConstraintsByCandidate, PickedDateWithMembers } from "@/schema/schedule";

type CandidateAreaProps = {
  optCandidate: PickedDateWithMembers;
  consCandidate: ConstraintsByCandidate;
  children: ReactNode;
  removeThis?: () => void;
};

const CandidateArea: FC<CandidateAreaProps> = ({ consCandidate, children, removeThis }) => {
  const { candidate: date, group: _, tasks: __, irregular_member_count_constraint: _member_count } = consCandidate;
  return (
    <div className="flex w-full items-center space-x-2 border-b border-slate-700 px-4 py-1">
      <div className="flex w-20 shrink-0 items-center justify-center space-x-2">
        <div>{date.format("M/D")}</div>
        {removeThis && (
          <div>
            <IconButton onClick={removeThis}>
              <FaTrash size={12} color="gray" />
            </IconButton>
          </div>
        )}
      </div>
      <div className="flex grow flex-wrap">{children}</div>
    </div>
  );
};

export default CandidateArea;
