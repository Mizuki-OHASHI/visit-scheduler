import { useParams, useRouter } from "next/navigation";
import { FC } from "react";

import { chouseisanIdSchema } from "@/schema/id";

const ScheduleAdjustmentChouseisanIdPage: FC = () => {
  const { chouseisanId } = useParams<{ chouseisanId: string }>();
  const { data: parsedChouseisanId, success } = chouseisanIdSchema.safeParse(chouseisanId);
  const router = useRouter();

  if (!success) router.replace("/schedule/adjustment");

  return <div>{parsedChouseisanId}</div>;
};

export default ScheduleAdjustmentChouseisanIdPage;
