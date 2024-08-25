import cn from "classnames";
import { ReactNode, useEffect, useState } from "react";

type SelectBoxWithButtonProps<T extends string | number> = {
  options: T[];
  onChange: (value: T) => void;
  keyToLabel?: (key: T) => string;
  className?: string;
  icon: {
    open: ReactNode;
    close: ReactNode;
  };
};

const SelectBoxWithButton = <T extends string | number>({
  options,
  onChange,
  className,
  keyToLabel,
  icon,
}: SelectBoxWithButtonProps<T>) => {
  const [showSelect, setShowSelect] = useState(false);

  const toggleSelectBox = () => {
    setShowSelect((prevState) => !prevState);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!showSelect) return;
      if (!e.target) return;
      const target = e.target as HTMLElement;
      if (!target.closest(".select-box-with-button")) {
        setShowSelect(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [showSelect]);

  return (
    <div className={cn("size-full flex items-center relative", className)}>
      <button onClick={toggleSelectBox} className="size-full">
        {showSelect ? icon.open : icon.close}
      </button>
      {showSelect && (
        <div className="absolute left-0 top-6 z-10 flex h-48 w-64 flex-wrap items-start justify-center overflow-y-scroll rounded-lg bg-slate-700 p-2 text-xs">
          {options.map((option) => (
            <div className="flex flex-wrap" key={option}>
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setShowSelect(false);
                }}
                className="m-0.5 rounded-full bg-slate-900 px-2 py-1"
              >
                {keyToLabel ? keyToLabel(option) : option}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectBoxWithButton;
