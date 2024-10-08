import { FC } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiAdminLine, RiCalendar2Line, RiDashboardLine } from "react-icons/ri";
import { TbAdjustments } from "react-icons/tb";
import { useRecoilValue } from "recoil";

import NavigationItem, { type NavigationItemProps } from "#/layout/navigation/navigation-item";
import { getUserFromContext, userContextAtom } from "@/config/recoil";

const Navigation: FC = () => {
  const navigationItems = [
    {
      path: "/",
      label: "ダッシュボード",
      Icon: <RiDashboardLine size={24} color="gray" />,
    },
    {
      path: "/member",
      label: "メンバー情報",
      Icon: <HiOutlineUserGroup size={24} color="gray" />,
    },
    {
      path: "/schedule/list",
      label: "スケジュール一覧",
      Icon: <RiCalendar2Line size={24} color="gray" />,
    },
    {
      path: "/schedule/adjustment/*", // '*': wildcard
      label: "スケジュール調整",
      Icon: <TbAdjustments size={24} color="gray" />,
    },
    {
      path: "/me",
      label: "アカウント",
      Icon: <AiOutlineUser size={24} color="gray" />,
    },
    {
      path: "/about",
      label: "アプリについて",
      Icon: <HiOutlineInformationCircle size={24} color="gray" />,
    },
  ] satisfies NavigationItemProps[];

  const userCtx = useRecoilValue(userContextAtom);
  const user = getUserFromContext(userCtx);

  if (!user) return null;
  if (user.role === "dev")
    navigationItems.push({
      path: "/dev",
      label: "開発者ページ",
      Icon: <RiAdminLine size={24} color="red" />,
    });

  return (
    <div className="flex h-12 w-full shrink-0 justify-around bg-slate-950 text-slate-300 transition-all duration-100 sm:size-12 sm:h-full sm:flex-col sm:justify-start md:w-52">
      {navigationItems.map((item) => (
        <NavigationItem key={item.path} {...item} />
      ))}
    </div>
  );
};

export default Navigation;
