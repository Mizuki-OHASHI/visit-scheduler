"use client";

import { FC } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { RiCalendar2Line, RiDashboardLine } from "react-icons/ri";
import { TbAdjustments } from "react-icons/tb";

import NavigationItem, { type NavigationItemProps } from "#/layout/navigation/navigation-item";

const Navigation: FC = () => {
  const navigationItems = [
    {
      path: "/",
      label: "ダッシュボード",
      Icon: <RiDashboardLine size={24} color="gray" />,
    },
    {
      path: "/schedule/input",
      label: "スケジュール入力",
      Icon: <RiCalendar2Line size={24} color="gray" />,
    },
    {
      path: "/schedule/adjustment",
      label: "スケジュール調整",
      Icon: <TbAdjustments size={24} color="gray" />,
    },
    {
      path: "/me",
      label: "プロフィール",
      Icon: <AiOutlineUser size={24} color="gray" />,
    },
  ] satisfies NavigationItemProps[];

  return (
    <div className="sticky left-0 top-0 flex h-12 w-full shrink-0 justify-around bg-slate-950 text-slate-300 transition-all duration-100 sm:size-12 sm:h-full sm:flex-col sm:justify-start md:w-52">
      {navigationItems.map((item) => (
        <NavigationItem key={item.path} {...item} />
      ))}
    </div>
  );
};

export default Navigation;
