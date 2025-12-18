import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { MdCheck, MdClose, MdExpandLess, MdExpandMore } from "react-icons/md";

type MultiSelectProps<T extends string | number> = {
  options: T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  keyToLabel?: (key: T) => string;
  className?: string;
  placeholder?: string;
};

const MultiSelect = <T extends string | number>({
  options,
  selected,
  onChange,
  keyToLabel,
  className,
  placeholder = "選択してください",
}: MultiSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOption = (option: T) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option: T) => {
    onChange(selected.filter((s) => s !== option));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getLabel = (option: T) => (keyToLabel ? keyToLabel(option) : String(option));

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} ref={containerRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
        >
          <span className="text-slate-400">{placeholder}</span>
          {isOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-max min-w-full overflow-y-auto rounded-lg border border-slate-700 bg-slate-800 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                className="flex w-full items-center justify-between gap-4 px-3 py-2 hover:bg-slate-700"
              >
                <span>{getLabel(option)}</span>
                {selected.includes(option) && <MdCheck size={18} className="text-green-500" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.map((option) => (
        <span
          key={option}
          className="flex items-center gap-1 rounded-full bg-slate-700 px-2 py-0.5 text-sm"
        >
          {getLabel(option)}
          <button type="button" onClick={() => removeOption(option)} className="hover:text-red-400">
            <MdClose size={14} />
          </button>
        </span>
      ))}
    </div>
  );
};

export default MultiSelect;
