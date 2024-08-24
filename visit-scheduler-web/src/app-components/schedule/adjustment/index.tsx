import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

const ScheduleAdjustmentPage: FC = () => {
  const router = useRouter();
  useEffect(() => {
    const lastViewdChouseisanId = localStorage.getItem("last-chouseisan-id");
    if (lastViewdChouseisanId) router.replace(`/schedule/adjustment/${lastViewdChouseisanId}`);
  }, [router]);

  return (
    <div className="mx-8 text-center">
      <Link href="/schedule/list" className="underline">
        スケジュール一覧
      </Link>
      のページから
      <br />
      調整を行いたいスケジュールを選択してください。
    </div>
  );
};

export default ScheduleAdjustmentPage;
