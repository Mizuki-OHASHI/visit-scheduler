import { FC } from "react";

type BasicInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

const BasicInput: FC<BasicInputProps> = ({ value, onChange, placeholder = "" }) => {
  return (
    <div className="flex size-full items-center rounded border border-slate-700 bg-slate-900">
      <input
        type="text"
        className="size-full grow bg-transparent p-2 outline-none placeholder:text-slate-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default BasicInput;
