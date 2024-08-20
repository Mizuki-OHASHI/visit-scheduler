import cn from "classnames";
import { FC } from "react";

import { ComponentSize } from "@/components/props-types";

type BasicButtonProps = {
  onClick: () => void;
  label: string;
  size?: ComponentSize;
};
const BasicButton: FC<BasicButtonProps> = ({ label, onClick, size = "md" }) => {
  return (
    <button
      onClick={onClick}
      className={cn("rounded-md hover:bg-slate-100/50", {
        "size-12": size === "sm",
        "size-16": size === "md",
        "size-20": size === "lg",
      })}
    >
      {label}
    </button>
  );
};

export default BasicButton;
