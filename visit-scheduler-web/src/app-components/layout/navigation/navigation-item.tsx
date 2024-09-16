import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

export type NavigationItemProps = {
  path: string;
  label: string;
  Icon: ReactNode;
};

const NavigationItem: FC<NavigationItemProps> = ({ path, label, Icon }) => {
  const pathname = usePathname();
  const pathMatcher = (path: string): RegExp => {
    return new RegExp(`^${path.replace(/\//g, "\\/").replace(/\*/g, ".*")}$`);
  };

  return (
    <Link href={path} passHref legacyBehavior>
      <div
        className={cn(
          "flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden hover:opacity-50 sm:justify-start",
          {
            "bg-slate-900": pathMatcher(path).test(pathname),
          },
        )}
      >
        <div className="flex size-12 shrink-0 items-center justify-center">{Icon}</div>
        <div className="hidden break-keep sm:block">{label}</div>
      </div>
    </Link>
  );
};

export default NavigationItem;
