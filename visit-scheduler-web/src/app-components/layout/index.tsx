"use client";

import { FC, ReactNode } from "react";

import Header from "#/layout/header";
import Navigation from "#/layout/navigation";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />
      <div className="flex h-[calc(100vh-7rem)] w-full grow flex-col-reverse sm:h-[calc(100vh-4rem)] sm:flex-row">
        <Navigation />
        <div className="flex w-full grow items-center justify-center overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
