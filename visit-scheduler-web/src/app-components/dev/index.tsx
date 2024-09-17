import { FC } from "react";
import { MdSync } from "react-icons/md";

import { useCommon } from "@/api/useCommon";
import IconButton from "@/components/button/icon-button";
import TaskTag from "@/components/tag/task";

const DevPage: FC = () => {
  const { fetchCommon, refreshCommon } = useCommon();

  const refreshHandler = () => {
    refreshCommon
      .trigger()
      .then(() => {
        fetchCommon.refetch();
        alert("更新しました。");
      })
      .catch((error) => {
        console.error(error);
        alert("更新に失敗しました。");
      });
  };

  return (
    <div className="flex w-3/4 flex-col items-center space-y-4 p-8 pb-16">
      <div className="flex w-full items-center justify-between">
        <span>タスク一覧</span>
        <div className="flex items-center space-x-2">
          <IconButton onClick={refreshHandler}>
            <MdSync size={20} />
          </IconButton>
          <span className="text-xs">更新</span>
        </div>
      </div>
      <div className="flex flex-wrap">
        {fetchCommon.data?.task_list.map((task) => (
          <TaskTag key={task} task={task} />
        ))}
      </div>
    </div>
  );
};

export default DevPage;
