"use client";

import { FC, ReactNode } from "react";
import { RecoilRoot } from "recoil";

const VSContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default VSContextProvider;
