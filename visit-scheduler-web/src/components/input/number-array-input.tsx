import cn from "classnames";
import { FC, useState } from "react";

type NumberArrayInputProps = {
  value: number[];
  onChange: (value: number[]) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
};

const NumberArrayInput: FC<NumberArrayInputProps> = ({ value, onChange, min, max, placeholder, className }) => {
  const [textValue, setTextValue] = useState(value.join(", "));

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const splitted = e.target.value
      .replaceAll(" ", "")
      .split(",")
      .filter((v) => v !== "");
    const parsed = splitted.map((v) => parseInt(v));
    if (parsed.some((v) => isNaN(v))) {
      alert("カンマ区切りの数値を入力してください。");
      return;
    }
    if (min !== undefined && parsed.some((v) => v < min)) {
      alert(`最小値は ${min} です。`);
      return;
    }
    if (max !== undefined && parsed.some((v) => v > max)) {
      alert(`最大値は ${max} です。`);
      return;
    }
    setTextValue(e.target.value);
    if (parsed.length === 0) return;

    onChange(parsed);
  };
  return (
    <div className={cn("flex size-full items-center rounded-xl border border-slate-700 bg-slate-900 p-2", className)}>
      <input
        type="text"
        className="size-full bg-transparent text-right outline-none placeholder:text-slate-700"
        value={textValue}
        onChange={onChangeHandler}
        placeholder={placeholder}
        disabled={!onChange}
      />
    </div>
  );
};

export default NumberArrayInput;
