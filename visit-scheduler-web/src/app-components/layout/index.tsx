"use client";

import { FC, ReactNode } from "react";

import Header from "#/layout/header";
import Navigation from "#/layout/navigation";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />
      <div className="flex size-full flex-col-reverse sm:flex-row">
        <Navigation />
        <div className="flex size-full items-center justify-center">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
