import { useMemo } from "react";

import CandidateArea from "#/schedule/adjustment/chouseisan-id/component/optimized-schedule/candidate-area";
import VisitUserCard from "#/schedule/adjustment/chouseisan-id/component/optimized-schedule/visit-user-card";
import { arrayToRecord } from "@/lib/array";
import { ConstraintsByCandidate, OptimizedSchedule } from "@/schema/schedule";
import { VisitUser } from "@/schema/user";

type OptimizedScheduleProps = {
  optimizedSchedule: OptimizedSchedule;
  constraints: ConstraintsByCandidate[];
  visitUsers: VisitUser[];
};

export const OptimizedScheduleComponent = ({ optimizedSchedule, constraints, visitUsers }: OptimizedScheduleProps) => {
  const { schedule } = optimizedSchedule;

  const consCandidateRecord = useMemo(
    () => arrayToRecord(constraints, (c) => c.candidate.toISOString()),
    [constraints],
  );

  const visitUserRecord = useMemo(() => arrayToRecord(visitUsers, (v) => v.id), [visitUsers]);

  const sortedSchedule = useMemo(
    () => schedule.slice().sort((a, b) => a.date.valueOf() - b.date.valueOf()),
    [schedule],
  );

  return (
    <div className="w-full">
      {sortedSchedule.map((candidate) => (
        <CandidateArea
          key={candidate.date.toISOString()}
          optCandidate={candidate}
          consCandidate={consCandidateRecord[candidate.date.toISOString()]}
        >
          {candidate.member.map((member) => (
            <VisitUserCard visitUser={visitUserRecord[member]} key={member} />
          ))}
        </CandidateArea>
      ))}
    </div>
  );
};
