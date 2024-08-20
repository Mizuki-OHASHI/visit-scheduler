import { FC, useState } from "react";
import { MdSync } from "react-icons/md";

import InputWithButton from "@/components/input/input-with-button";
import { fetchChouseisanCsv } from "@/lib/chouseisan";
import { chouseisanIdSchema } from "@/schema/visit-schedule";

const ScheduleInputPage: FC = () => {
  const chouseisanPlaceholder = "https://chouseisan.com/s?h=0123456789abcdef0123456789abcdef";
  const [chouseisanLink, setChouseisanLink] = useState("https://chouseisan.com/s?h=c6c6239d313e4ce0ae4dd2425dca1a32");
  // https://chouseisan.com/s?h=c6c6239d313e4ce0ae4dd2425dca1a32

  return (
    <div className="flex size-full flex-col items-center py-8">
      <div className="flex w-full flex-col items-center space-y-4 px-8 md:w-2/3">
        <div>調整さんのリンクを入力し、メンバーのスケジュールを同期します。</div>
        <InputWithButton
          value={chouseisanLink}
          onChange={(v) => setChouseisanLink(v)}
          onClick={(v) => fetchChouseisanCsv(chouseisanIdSchema.parse(v)).then(console.log).catch(console.error)}
          buttonIcon={<MdSync size={24} color="gray" />}
          placeholder={chouseisanPlaceholder}
        />
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default ScheduleInputPage;
