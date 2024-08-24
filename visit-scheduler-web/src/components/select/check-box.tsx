import cn from "classnames";
import { FC } from "react";
import { MdCheck } from "react-icons/md";

type CheckBoxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const CheckBox: FC<CheckBoxProps> = ({ checked, onChange }) => {
  return (
    <div
      className={cn(
        "size-6 border border-slate-700 rounded-md flex items-center justify-center cursor-pointer",
        checked ? "bg-slate-700" : "bg-transparent",
      )}
      onClick={() => onChange(!checked)}
    >
      {checked && <MdCheck size={24} color="gray" />}
    </div>
  );
};

export default CheckBox;
