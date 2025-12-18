import Link from "next/link";
import { FC } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { TbAdjustments } from "react-icons/tb";

import IconButton from "@/components/button/icon-button";
import { ScheduleMaster } from "@/schema/schedule";

type ScheduleListItemProps = {
  schedule: ScheduleMaster;
};

const ScheduleListItem: FC<ScheduleListItemProps> = ({ schedule }) => {
  const sortedCandidates = schedule.candidates.slice().sort((a, b) => a.valueOf() - b.valueOf());

  return (
    <div className="flex w-full items-center border-b border-gray-700 px-4 py-1">
      <div className="grow truncate">{schedule.title}</div>
      <div className="hidden w-32 text-center text-sm sm:block">
        {[sortedCandidates[0].format("M/D"), "〜", sortedCandidates[sortedCandidates.length - 1].format("M/D")].join(
          " ",
        )}
      </div>
      <div className="flex w-20 items-center justify-center space-x-2">
        <Link href={`/schedule/adjustment/${schedule.chouseisan_id}`}>
          <IconButton>
            <TbAdjustments size={20} />
          </IconButton>
        </Link>
        <Link href={`https://chouseisan.com/s?h=${schedule.chouseisan_id}`} target="_blank">
          <IconButton>
            <HiOutlineExternalLink size={20} />
          </IconButton>
        </Link>
      </div>
    </div>
  );
};

export default ScheduleListItem;
