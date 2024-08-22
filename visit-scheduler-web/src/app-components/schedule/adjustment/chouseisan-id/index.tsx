import { useParams, useRouter } from "next/navigation";
import { FC, useEffect } from "react";

import { chouseisanIdSchema } from "@/schema/id";

const ScheduleAdjustmentChouseisanIdPage: FC = () => {
  const { chouseisanId } = useParams<{ chouseisanId: string }>();
  const { data: parsedChouseisanId, success } = chouseisanIdSchema.safeParse(chouseisanId);

  const router = useRouter();

  useEffect(() => {
    if (!success) router.replace("/schedule/adjustment");
    else localStorage.setItem("last-chouseisan-id", parsedChouseisanId);
  }, [success, parsedChouseisanId, router]);

  if (!success) return null;

  return <div>{parsedChouseisanId}</div>;
};

export default ScheduleAdjustmentChouseisanIdPage;
