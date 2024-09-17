import { FC } from "react";

const TaskTag: FC<{ task: string }> = ({ task }) => {
  return <div className="m-0.5 rounded-full bg-slate-700 px-2 py-1 text-xs">{task}</div>;
};

export default TaskTag;
