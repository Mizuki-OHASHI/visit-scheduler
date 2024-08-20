import cn from "classnames";
import { Metadata } from "next";
import { ReactNode } from "react";

import "@/styles/globals.css";
import Layout from "@/app-components/layout";
import VSAuthNProvider from "@/app-components/provider/authentication-provider";
import VSAuthZProvider from "@/app-components/provider/authorization-probider";
import VSContextProvider from "@/app-components/provider/context-provider";
import { zenKakuGothicAntique, robotoMono } from "@/config/font";

export const metadata: Metadata = {
  title: "訪問組みアプリ",
  description: "訪問組みアプリ",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="ja">
      <body className={cn(zenKakuGothicAntique.className, robotoMono.variable)}>
        <VSContextProvider>
          <VSAuthNProvider>
            <VSAuthZProvider>
              <Layout>{children}</Layout>
            </VSAuthZProvider>
          </VSAuthNProvider>
        </VSContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
