import cn from "classnames";
import { FC, ReactNode } from "react";

import { ComponentSize } from "@/components/props-types";

type BasicButtonProps = {
  onClick: () => void;
  children: ReactNode;
  size?: ComponentSize;
  disabled?: boolean;
};
const BasicButton: FC<BasicButtonProps> = ({ children, onClick, size = "md", disabled }) => {
  return (
    <button
      onClick={() => !disabled && onClick()}
      className={cn("rounded-xl size-full border-slate-700 border", {
        "size-12": size === "sm",
        "size-16": size === "md",
        "size-20": size === "lg",
        "hover:bg-slate-100/5": !disabled,
      })}
    >
      {children}
    </button>
  );
};

export default BasicButton;
