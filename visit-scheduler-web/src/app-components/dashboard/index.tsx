import dayjs from "dayjs";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdCalendarMonth, MdFeedback, MdGroups, MdPerson, MdPlayArrow } from "react-icons/md";
import { useRecoilValue } from "recoil";

import { updateInfo } from "#/about/update-info";
import { getUserFromContext, userContextAtom } from "@/config/recoil";

const DashboardPage: FC = () => {
  const userCtx = useRecoilValue(userContextAtom);
  const user = getUserFromContext(userCtx);
  const [lastChouseisanId, setLastChouseisanId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("last-chouseisan-id");
    setLastChouseisanId(stored);
  }, []);

  const recentUpdates = updateInfo.filter((info) => {
    const updateDate = dayjs(info.date);
    const oneMonthAgo = dayjs().subtract(1, "month");
    return updateDate.isAfter(oneMonthAgo);
  });

  return (
    <div className="flex size-full flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* User Info */}
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-slate-300">
            <MdPerson size={20} />
            <span>{user?.display_name ?? "ゲスト"}さんとしてログイン中</span>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Resume Recent Adjustment */}
          {lastChouseisanId && (
            <Link
              href={`/schedule/adjustment/${lastChouseisanId}`}
              className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 p-4 transition-colors hover:bg-slate-800"
            >
              <div className="rounded-full bg-blue-900 p-2">
                <MdPlayArrow size={24} className="text-blue-300" />
              </div>
              <div>
                <div className="font-medium">直近の調整を再開</div>
                <div className="text-sm text-slate-400">前回の調整ページに戻る</div>
              </div>
            </Link>
          )}

          {/* Feedback */}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSfEUb2Dxdlnc_J_jchvDwGoz6J0r6Pl9DV4NFZ7fAY1QVsGuQ/viewform?usp=sf_link"
            target="_blank"
            className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 p-4 transition-colors hover:bg-slate-800"
          >
            <div className="rounded-full bg-green-900 p-2">
              <MdFeedback size={24} className="text-green-300" />
            </div>
            <div>
              <div className="font-medium">フィードバック</div>
              <div className="text-sm text-slate-400">ご意見・ご要望をお聞かせください</div>
            </div>
          </Link>
        </div>

        {/* Quick Navigation */}
        <div>
          <h2 className="mb-4 text-lg text-slate-400">クイックナビ</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/schedule/list"
              className="flex flex-col items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 p-4 transition-colors hover:bg-slate-800"
            >
              <MdCalendarMonth size={32} className="text-slate-300" />
              <span>スケジュール一覧</span>
            </Link>
            <Link
              href="/member"
              className="flex flex-col items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 p-4 transition-colors hover:bg-slate-800"
            >
              <MdGroups size={32} className="text-slate-300" />
              <span>メンバー一覧</span>
            </Link>
            <Link
              href="/me"
              className="flex flex-col items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 p-4 transition-colors hover:bg-slate-800"
            >
              <MdPerson size={32} className="text-slate-300" />
              <span>アカウント</span>
            </Link>
          </div>
        </div>

        {/* Recent Updates */}
        {recentUpdates.length > 0 && (
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <h2 className="mb-3 text-lg text-slate-400">アップデート情報</h2>
            <ul className="space-y-2 text-sm">
              {recentUpdates.slice(0, 1).map((info) =>
                info.contents.map((content, idx) => (
                  <li key={`${info.date}-${idx}`} className="text-slate-300">
                    • {content}
                  </li>
                )),
              )}
            </ul>
            <Link href="/about" className="mt-3 inline-block text-sm text-blue-400 hover:underline">
              詳細を見る →
            </Link>
          </div>
        )}

        {/* External Links */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <Link
            href="https://chouseisan.com"
            target="_blank"
            className="flex items-center gap-1 hover:text-slate-300"
          >
            <HiOutlineExternalLink size={16} />
            <span>調整さん公式サイト</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
