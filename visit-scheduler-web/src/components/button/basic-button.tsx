import cn from "classnames";
import { FC, ReactNode } from "react";

import { ComponentSize } from "@/components/props-types";

type BasicButtonProps = {
  onClick: () => void;
  children: ReactNode;
  size?: ComponentSize;
};
const BasicButton: FC<BasicButtonProps> = ({ children, onClick, size = "md" }) => {
  return (
    <button
      onClick={onClick}
      className={cn("rounded-md hover:bg-slate-100/5 size-full border-slate-700 border", {
        "size-12": size === "sm",
        "size-16": size === "md",
        "size-20": size === "lg",
      })}
    >
      {children}
    </button>
  );
};

export default BasicButton;
