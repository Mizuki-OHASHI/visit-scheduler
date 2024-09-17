import cn from "classnames";

type BasicSelectProps<T> = {
  value: T | null;
  options: T[];
  onChange: (value: T) => void;
  keyToLabel?: (key: T) => string;
  className?: string;
  placeholder?: string;
};

const BasicSelect = <T extends string | number>({
  value,
  options,
  onChange,
  className,
  keyToLabel,
  placeholder = "選択してください",
}: BasicSelectProps<T>) => {
  return (
    <div className={cn("flex size-full items-center rounded-xl border border-slate-700 bg-slate-900", className)}>
      <select
        className="size-full bg-transparent text-center outline-none placeholder:text-slate-700"
        value={value ?? ""}
        onChange={(e) => onChange && onChange(e.target.value as T)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {keyToLabel ? keyToLabel(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BasicSelect;
