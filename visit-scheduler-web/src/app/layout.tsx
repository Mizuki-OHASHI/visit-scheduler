import cn from "classnames";
import { ReactNode } from "react";

import type { Metadata } from "next";

import "@/styles/globals.css";
import Layout from "@/app-components/layout";
import { zenKakuGothicAntique, robotoMono } from "@/config/font";

export const metadata: Metadata = {
  title: "訪問組みアプリ",
  description: "訪問組みアプリ",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="ja">
      <body className={cn(zenKakuGothicAntique.className, robotoMono.variable)}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
};

export default RootLayout;
