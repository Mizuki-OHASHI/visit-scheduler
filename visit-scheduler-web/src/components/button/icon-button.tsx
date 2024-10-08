import cn from "classnames";
import { FC, ReactNode } from "react";

import { ComponentSize } from "@/components/props-types";

type IconButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  size?: ComponentSize;
};

const IconButton: FC<IconButtonProps> = ({ children, onClick, size = "md" }) => {
  return (
    <button
      onClick={onClick}
      className={cn("rounded-full hover:bg-slate-100/5 flex items-center justify-center aspect-square", {
        "size-8": size === "sm",
        "size-10": size === "md",
        "size-12": size === "lg",
      })}
    >
      {children}
    </button>
  );
};

export default IconButton;
