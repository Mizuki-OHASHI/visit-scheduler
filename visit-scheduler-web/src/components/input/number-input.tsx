import cn from "classnames";
import { FC } from "react";

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  noBorder?: boolean;
};

const NumberInput: FC<NumberInputProps> = ({ value, onChange, min, max, step, placeholder, className, noBorder }) => {
  return (
    <div
      className={cn(
        "flex size-full items-center rounded-xl bg-transparent p-2",
        { "border border-slate-700": !noBorder },
        className,
      )}
    >
      <input
        type="number"
        className="size-full bg-transparent text-right outline-none placeholder:text-slate-700"
        value={value}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        placeholder={placeholder}
        disabled={!onChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default NumberInput;
