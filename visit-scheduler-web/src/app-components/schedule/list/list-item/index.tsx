import { FC } from "react";
import { MdSync } from "react-icons/md";
import { TbAdjustments } from "react-icons/tb";

import IconButton from "@/components/button/icon-button";
import { ScheduleMaster } from "@/schema/schedule";

type ScheduleListItemProps = {
  schedule: ScheduleMaster;
  onClick: () => void;
};

const ScheduleListItem: FC<ScheduleListItemProps> = ({ schedule, onClick }) => {
  const sortedCandidates = schedule.candidates.slice().sort((a, b) => a.date.valueOf() - b.date.valueOf());
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between border-b border-gray-700 px-4">
        <div>{schedule.title}</div>
        <div>
          {[
            sortedCandidates[0].date.format("M/D"),
            "〜",
            sortedCandidates[sortedCandidates.length - 1].date.format("M/D"),
          ].join(" ")}
        </div>
        <div className="flex h-8 items-center space-x-2">
          <IconButton
            onClick={() => {
              console.log("adj");
            }}
          >
            <TbAdjustments size={20} />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log("sync");
            }}
          >
            <MdSync size={20} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ScheduleListItem;
