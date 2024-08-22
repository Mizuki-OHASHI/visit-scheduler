import cn from "classnames";
import { FC } from "react";

type BasicInputProps = {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
  noBorder?: boolean;
};

const BasicInput: FC<BasicInputProps> = ({ value, onChange, placeholder, className, noBorder }) => {
  return (
    <div
      className={cn(
        "flex size-full items-center rounded-xl bg-transparent p-2",
        { "border border-slate-700": !noBorder },
        className,
      )}
    >
      <input
        type="text"
        className="size-full grow bg-transparent outline-none placeholder:text-slate-700"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={!onChange}
      />
    </div>
  );
};

export default BasicInput;
