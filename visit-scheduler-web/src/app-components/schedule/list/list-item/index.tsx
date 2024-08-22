import Link from "next/link";
import { FC } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdSync } from "react-icons/md";
import { TbAdjustments } from "react-icons/tb";

import IconButton from "@/components/button/icon-button";
import { ScheduleMaster } from "@/schema/schedule";

type ScheduleListItemProps = {
  schedule: ScheduleMaster;
  onClick: () => void;
};

const ScheduleListItem: FC<ScheduleListItemProps> = ({ schedule, onClick }) => {
  const sortedCandidates = schedule.candidates.slice().sort((a, b) => a.valueOf() - b.valueOf());
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between border-b border-gray-700 px-4">
        <div>{schedule.title}</div>
        <div className="hidden sm:block">
          {[sortedCandidates[0].format("M/D"), "〜", sortedCandidates[sortedCandidates.length - 1].format("M/D")].join(
            " ",
          )}
        </div>
        <div className="flex h-8 items-center space-x-2">
          <Link href={`/schedule/adjustment/${schedule.chouseisan_id}`}>
            <IconButton
              onClick={() => {
                console.log("adj");
              }}
            >
              <TbAdjustments size={20} />
            </IconButton>
          </Link>
          <IconButton
            onClick={() => {
              console.log("sync");
            }}
          >
            <MdSync size={20} />
          </IconButton>
          <Link href={`https://chouseisan.com/s?h=${schedule.chouseisan_id}`} target="_blank">
            <IconButton
              onClick={() => {
                console.log("adj");
              }}
            >
              <HiOutlineExternalLink size={20} />
            </IconButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScheduleListItem;
