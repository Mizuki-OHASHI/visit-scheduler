import { ChangeEvent, useState } from "react";

type InputSelectProps<T> = {
  options: T[];
  onSelect: (selectedValue: T) => void;
  placeholder?: string;
};

const InputSelect = <T extends string>({ options, onSelect, placeholder }: InputSelectProps<T>) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Check if the entered value matches one of the options, then trigger onSelect
    if (options.includes(newValue as T)) {
      onSelect(newValue as T);
      setInputValue("");
    }
  };

  return (
    <div className="flex size-full items-center rounded-xl border border-slate-700 bg-transparent px-2 py-1">
      <input
        type="text"
        list="input-select-options"
        className="size-full bg-transparent outline-none placeholder:text-slate-700"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
      <datalist id="input-select-options">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </datalist>
    </div>
  );
};

export default InputSelect;
