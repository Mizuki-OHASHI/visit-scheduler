import { FC } from "react";
import { FaMinus } from "react-icons/fa";

type TaskCardProps = {
  task: string;
  num: number;
  reduce: () => void;
};

const TaskCard: FC<TaskCardProps> = ({ task, num, reduce }) => {
  return (
    <div className="flex size-full h-6 items-center space-x-2 rounded-full bg-slate-700 px-2 text-sm">
      <div className="grow">{num > 1 ? `${task} (${num})` : task}</div>
      <button onClick={reduce} className="aspect-square h-1/2">
        <FaMinus size={12} color="gray" />
      </button>
    </div>
  );
};

export default TaskCard;
