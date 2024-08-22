type BasicSelectProps<T> = {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  keyToLabel?: (key: T) => string;
  className?: string;
};

const BasicSelect = <T extends string | number>({
  value,
  options,
  onChange,
  className,
  keyToLabel,
}: BasicSelectProps<T>) => {
  return (
    <div className={`flex size-full items-center rounded-xl border border-slate-700 bg-slate-900 ${className}`}>
      <select
        className="size-full bg-transparent text-center outline-none placeholder:text-slate-700"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value as T)}
      >
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
