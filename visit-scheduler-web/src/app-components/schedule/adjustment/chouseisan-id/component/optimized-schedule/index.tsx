import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { FaCopy } from "react-icons/fa";

import CandidateArea from "#/schedule/adjustment/chouseisan-id/component/optimized-schedule/candidate-area";
import VisitUserCard from "#/schedule/adjustment/chouseisan-id/component/optimized-schedule/visit-user-card";
import { useSchedule } from "@/api/useSchedule";
import BasicButton from "@/components/button/basic-button";
import IconButton from "@/components/button/icon-button";
import BasicSelect from "@/components/select/basic-select";
import CheckBox from "@/components/select/check-box";
import { arrayToRecord, filterMap } from "@/lib/array";
import { Date, newDate } from "@/lib/datetime";
import { ScheduleStatus } from "@/schema/enum";
import { VisitUserId } from "@/schema/id";
import {
  ConstraintsByCandidate,
  OptimizedSchedule,
  optimizedScheduleSchema,
  PickedDateWithMembers,
} from "@/schema/schedule";
import { VisitUser } from "@/schema/user";

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
  const [dateToAdd, setDateToAdd] = useState<Date | null>(null);

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

  const addVisitDateHandler = (date: Date) => {
    setSchedulesOnEdit((schedules) => schedules.concat({ date, member: [] }));
    alert(`${date.format("M/D")} を追加しました。`);
  };

  const removeVisitDateHandler = (date: Date) => {
    if (!confirm(`${date.format("M/D")} を削除しますか？`)) return;
    setSchedulesOnEdit((schedules) => schedules.filter((s) => s.date.toISOString() !== date.toISOString()));
    alert(`${date.format("M/D")} を削除しました。`);
  };

  const unselectedDates = useMemo(() => {
    const selectedDates = sortedScheduleOnEdit.map((s) => s.date.toISOString());
    const unselectedDates_ = Object.keys(membersSchedulesByDate).filter((date) => !selectedDates.includes(date));
    if (unselectedDates_.length > 0) setDateToAdd(newDate(dayjs(unselectedDates_[0])));
    else setDateToAdd(null);
    return unselectedDates_;
  }, [membersSchedulesByDate, sortedScheduleOnEdit]);

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

  const notScheduledMembers = useMemo(() => {
    const scheduledMembers = new Set(sortedScheduleOnEdit.flatMap((s) => s.member));
    const answeredMembers = fetchMembersSchedule.data
      ? filterMap(fetchMembersSchedule.data, (m) => (m.schedules.some((s) => s.status !== "unavailable") ? m.id : null))
      : [];
    const notScheduled = answeredMembers.filter((m) => !scheduledMembers.has(m));
    return notScheduled;
  }, [fetchMembersSchedule.data, sortedScheduleOnEdit]);

  return (
    <div className="w-full pb-96">
      <div className="flex w-full items-center justify-between space-x-4 px-4">
        <div className="grow py-8 text-center text-xl">訪問スケジュール</div>
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
              removeThis={() => removeVisitDateHandler(candidate.date)}
            >
              <div className="flex size-full">
                <div className="w-1/3 flex-col px-2">
                  {candidate.member.map((member) => (
                    <VisitUserCard
                      visitUser={visitUserRecord[member]}
                      key={member}
                      onClick={removeMemberHandler(candidate.date, member)}
                    />
                  ))}
                </div>
                <div className="w-1/3 flex-col px-2">
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
                <div className="w-1/3 flex-col px-2">
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
          {unselectedDates.length > 0 && (
            <div className="flex w-full items-center space-x-4 p-4">
              <div className="h-8 min-w-24">
                <BasicSelect
                  options={unselectedDates}
                  value={dateToAdd?.toISOString() ?? ""}
                  onChange={(value) => {
                    setDateToAdd(newDate(dayjs(value)));
                  }}
                  keyToLabel={(key) => newDate(dayjs(key)).format("M/D")}
                />
              </div>
              <div className="h-8 grow">
                <BasicButton
                  onClick={() => {
                    if (dateToAdd) addVisitDateHandler(dateToAdd);
                  }}
                >
                  訪問日を追加する
                </BasicButton>
              </div>
            </div>
          )}
          <div className="flex h-20 w-full justify-center space-x-8 p-4">
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
      <div className="w-full py-8 text-center text-xl">訪問できない回答者</div>
      <div className="flex w-full flex-wrap justify-center">
        {notScheduledMembers.map((member) => (
          <VisitUserCard visitUser={visitUserRecord[member]} key={member} />
        ))}
      </div>
    </div>
  );
};
