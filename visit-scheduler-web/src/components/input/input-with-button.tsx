import cn from "classnames";
import { FC, ReactNode } from "react";

type InputWithButtonProps = {
  value: string;
  onChange: (v: string) => void;
  onClick: (v: string) => void;
  buttonIcon: ReactNode;
  placeholder?: string;
  buttonPosition?: "l" | "r";
};

const InputWithButton: FC<InputWithButtonProps> = ({
  value,
  onChange,
  onClick,
  buttonIcon,
  placeholder = "",
  buttonPosition = "r",
}) => {
  return (
    <div className="flex size-full items-center rounded-xl border border-slate-700 bg-slate-900">
      <input
        type="text"
        className="size-full grow bg-transparent p-2 outline-none placeholder:text-slate-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button
        className={cn(
          "flex aspect-square h-full items-center justify-center border-slate-700 hover:bg-slate-50/5 px-2",
          {
            "border-r": buttonPosition === "l",
            "border-l": buttonPosition === "r",
          },
        )}
        onClick={() => onClick(value)}
      >
        {buttonIcon}
      </button>
    </div>
  );
};

export default InputWithButton;
