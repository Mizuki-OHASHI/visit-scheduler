import { useEffect, useMemo, useState } from "react";

import CandidateArea from "#/schedule/adjustment/chouseisan-id/component/optimized-schedule/candidate-area";
import VisitUserCard from "#/schedule/adjustment/chouseisan-id/component/optimized-schedule/visit-user-card";
import { useSchedule } from "@/api/useSchedule";
import BasicButton from "@/components/button/basic-button";
import IconButton from "@/components/button/icon-button";
import CheckBox from "@/components/select/check-box";
import { arrayToRecord } from "@/lib/array";
import { Date } from "@/lib/datetime";
import { ScheduleStatus } from "@/schema/enum";
import { VisitUserId } from "@/schema/id";
import {
  ConstraintsByCandidate,
  OptimizedSchedule,
  optimizedScheduleSchema,
  PickedDateWithMembers,
} from "@/schema/schedule";
import { VisitUser } from "@/schema/user";
import { FaCopy } from "react-icons/fa";

type OptimizedScheduleProps = {
  optimizedSchedule: OptimizedSchedule;
  constraints: ConstraintsByCandidate[];
  visitUsers: VisitUser[];
};

export const OptimizedScheduleComponent = ({ optimizedSchedule, constraints, visitUsers }: OptimizedScheduleProps) => {
  const { schedule } = optimizedSchedule;
  const { fetchMembersSchedule, updateScheduleManually } = useSchedule(optimizedSchedule.chouseisan_id);
  const [editMode, setEditMode] = useState(false);
  const [schedulesOnEdit, setSchedulesOnEdit] = useState<PickedDateWithMembers[]>([]);

  useEffect(() => {
    setSchedulesOnEdit(schedule);
  }, [schedule]);

  const consCandidateRecord = useMemo(
    () => arrayToRecord(constraints, (c) => c.candidate.toISOString()),
    [constraints],
  );

  const visitUserRecord = useMemo(() => arrayToRecord(visitUsers, (v) => v.id), [visitUsers]);

  const sortedSchedule = useMemo(
    () => schedule.slice().sort((a, b) => a.date.valueOf() - b.date.valueOf()),
    [schedule],
  );

  const sortedScheduleOnEdit = useMemo(
    () => schedulesOnEdit.slice().sort((a, b) => a.date.valueOf() - b.date.valueOf()),
    [schedulesOnEdit],
  );

  const membersSchedulesByDate = useMemo(() => {
    if (!fetchMembersSchedule.data) return {};
    const result: Record<string, Record<ScheduleStatus, VisitUserId[]>> = {};

    fetchMembersSchedule.data.forEach((member) => {
      member.schedules.forEach((schedule) => {
        const dateKey = schedule.candidate.toISOString();
        if (!result[dateKey]) result[dateKey] = { preferred: [], available: [], unavailable: [] };
        result[dateKey][schedule.status].push(member.id);
      });
    });

    return result;
  }, [fetchMembersSchedule.data]);

  const addMemberHandler = (date: Date, member: VisitUserId) => () => {
    const dateKey = date.toISOString();
    const newSchedules = schedulesOnEdit.map((s) => {
      if (s.date.toISOString() === dateKey) {
        return { ...s, member: [...s.member, member] };
      }
      return s;
    });
    setSchedulesOnEdit(newSchedules);
  };

  const removeMemberHandler = (date: Date, member: VisitUserId) => () => {
    const dateKey = date.toISOString();
    const newSchedules = schedulesOnEdit.map((s) => {
      if (s.date.toISOString() === dateKey) {
        return { ...s, member: s.member.filter((m) => m !== member) };
      }
      return s;
    });
    setSchedulesOnEdit(newSchedules);
  };

  const isChanged = useMemo(() => {
    if (schedulesOnEdit.length !== schedule.length) return true;
    return schedulesOnEdit.some((s, i) => {
      if (s.date !== schedule[i].date) return true;
      if (s.member.length !== schedule[i].member.length) return true;
      return s.member.some((m, j) => m !== schedule[i].member[j]);
    });
  }, [schedule, schedulesOnEdit]);

  const resetHandler = () => {
    setSchedulesOnEdit(schedule);
  };

  const copyToClipboard = () => {
    const text = sortedSchedule
      .map((s) => {
        const members = s.member.map((m) => visitUserRecord[m].name).join(", ");
        return `${s.date.format("M/D")} ${members}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    alert("クリップボードにコピーしました。");
  };

  const saveHandler = () => {
    updateScheduleManually
      .trigger({
        data: optimizedScheduleSchema.parse({
          chouseisan_id: optimizedSchedule.chouseisan_id,
          schedule: schedulesOnEdit,
        }),
      })
      .then(() => {
        setEditMode(false);
        alert("保存しました。");
      })
      .catch((error) => {
        console.error(error);
        alert("保存に失敗しました。");
      });
  };

  return (
    <div className="w-full pb-96">
      <div className="w-full flex justify-between items-center px-4 space-x-4">
        <div className="text-center text-xl py-8 grow">訪問スケジュール</div>
        <div className="flex space-x-2">
          <CheckBox
            checked={editMode}
            onChange={() => {
              setEditMode(!editMode);
            }}
          />
          <span className="text-sm">編集モード</span>
        </div>
        <IconButton onClick={copyToClipboard}>
          <FaCopy color="gray" size={24} />
        </IconButton>
        コピー
      </div>
      <details className="w-full break-words p-4 text-sm">
        <summary>
          <span className="p-2">説明</span>
        </summary>
        <ul className="list-disc px-8 py-2">
          <li>カードが白いメンバーはドライバーです。</li>
          <li>編集モードでメンバー列のカードをクリックするとメンバーから削除できます。</li>
          <li>編集モードで○や△の列のカードをクリックするとメンバーを追加できます。</li>
        </ul>
      </details>
      <div className="flex w-full items-center space-x-2 border-b border-slate-700 px-4 py-1">
        <div className="w-20 shrink-0" />
        {editMode ? (
          <div className="flex grow flex-wrap text-center">
            <div className="w-1/3">メンバー</div>
            <div className="w-1/3">○</div>
            <div className="w-1/3">△</div>
          </div>
        ) : (
          <div className="w-full text-center">メンバー</div>
        )}
      </div>
      {editMode ? (
        <>
          {sortedScheduleOnEdit.map((candidate) => (
            <CandidateArea
              key={candidate.date.toISOString()}
              optCandidate={candidate}
              consCandidate={consCandidateRecord[candidate.date.toISOString()]}
            >
              <div className="size-full flex">
                <div className="w-1/3 px-2 flex-col">
                  {candidate.member.map((member) => (
                    <VisitUserCard
                      visitUser={visitUserRecord[member]}
                      key={member}
                      onClick={removeMemberHandler(candidate.date, member)}
                    />
                  ))}
                </div>
                <div className="w-1/3 px-2 flex-col">
                  {membersSchedulesByDate[candidate.date.toISOString()]?.preferred
                    .filter((member) => !candidate.member.includes(member))
                    .map((member) => (
                      <VisitUserCard
                        visitUser={visitUserRecord[member]}
                        key={member}
                        onClick={addMemberHandler(candidate.date, member)}
                      />
                    ))}
                </div>
                <div className="w-1/3 px-2 flex-col">
                  {membersSchedulesByDate[candidate.date.toISOString()]?.available
                    .filter((member) => !candidate.member.includes(member))
                    .map((member) => (
                      <VisitUserCard
                        visitUser={visitUserRecord[member]}
                        key={member}
                        onClick={addMemberHandler(candidate.date, member)}
                      />
                    ))}
                </div>
              </div>
            </CandidateArea>
          ))}
          <div className="w-full flex justify-center p-4 h-20 space-x-8">
            <BasicButton
              onClick={() => {
                resetHandler();
              }}
            >
              <span className="text-red-500">変更を破棄</span>
            </BasicButton>
            <BasicButton onClick={saveHandler} disabled={!isChanged}>
              変更を保存
            </BasicButton>
          </div>
        </>
      ) : (
        sortedSchedule.map((candidate) => (
          <CandidateArea
            key={candidate.date.toISOString()}
            optCandidate={candidate}
            consCandidate={consCandidateRecord[candidate.date.toISOString()]}
          >
            {candidate.member.map((member) => (
              <VisitUserCard visitUser={visitUserRecord[member]} key={member} />
            ))}
          </CandidateArea>
        ))
      )}
    </div>
  );
};
