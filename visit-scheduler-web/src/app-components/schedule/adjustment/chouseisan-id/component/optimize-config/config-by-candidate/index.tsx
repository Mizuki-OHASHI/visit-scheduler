import { FC } from "react";

import TaskCard from "#/schedule/adjustment/chouseisan-id/component/optimize-config/config-by-candidate/task-card.tsx";
import { useCommon } from "@/api/useCommon";
import BasicInput from "@/components/input/basic-input";
import NumberInput from "@/components/input/number-input";
import InputSelect from "@/components/select/input-select";
import { filterMap } from "@/lib/array";
import { ConstraintsByCandidate } from "@/schema/schedule";

type OprimizwConfigByCandidateProps = {
  constraints: ConstraintsByCandidate;
  basicMemberCount: number;
  onChangeConstraints: (constraints: ConstraintsByCandidate) => void;
};

const OptimizeConfigByCandidate: FC<OprimizwConfigByCandidateProps> = ({
  constraints,
  onChangeConstraints,
  basicMemberCount,
}) => {
  const { candidate, group, tasks, irregular_member_count_constraint: member_count } = constraints;
  // const [checked, setChecked] = useState(false);

  const { fetchCommon } = useCommon();
  const taskList = fetchCommon.data?.task_list ?? [];

  const reduceTask = (task: string) => {
    const newTasks = filterMap<[string, number], [string, number]>(tasks, ([t, c]) =>
      t !== task ? [t, c] : c === 1 ? null : [t, c - 1],
    );
    onChangeConstraints({ ...constraints, tasks: newTasks });
  };

  const addTask = (task: string) => {
    if (tasks.some(([t]) => t === task)) {
      onChangeConstraints({ ...constraints, tasks: tasks.map(([t, c]) => (t === task ? [t, c + 1] : [t, c])) });
      return;
    }
    onChangeConstraints({ ...constraints, tasks: [...tasks, [task, 1]] });
  };

  return (
    <div className="flex w-full items-center border-b border-slate-700 px-4 py-1">
      {/*
      <div className="w-1/12 text-center">
        <CheckBox
          checked={checked}
          onChange={() => {
            setChecked(!checked);
          }}
        />
      </div>
      */}
      <div className="w-1/6 text-center">{candidate.format("M/D")}</div>
      <div className="w-1/6">
        <BasicInput
          value={group ?? ""}
          onChange={(v) => onChangeConstraints({ ...constraints, group: v.trim() === "" ? null : v.trim() })}
          noBorder
        />
      </div>
      <div className="flex w-1/2 flex-wrap items-center">
        {tasks.map(([task, count]) => (
          <div className="m-0.5" key={task}>
            <TaskCard task={task} num={count} reduce={() => reduceTask(task)} />
          </div>
        ))}
        <div className="m-0.5 w-16">
          <InputSelect options={taskList} onSelect={(v) => addTask(v)} placeholder="追加" />
        </div>
      </div>
      <div className="w-1/6">
        <NumberInput
          value={member_count === null ? basicMemberCount : member_count}
          onChange={(v) =>
            onChangeConstraints({
              ...constraints,
              irregular_member_count_constraint: v === basicMemberCount ? null : v,
            })
          }
          min={0}
          noBorder
        />
      </div>
    </div>
  );
};

export default OptimizeConfigByCandidate;
