import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import BasicButton from "@/components/button/basic-button";

type AuthTemplateProps = {
  buttonMessage: string;
  onClick: () => void;
  linkMessage: string;
  linkPath: string;
};
const AuthTemplate: FC<AuthTemplateProps> = ({ buttonMessage, onClick, linkMessage, linkPath }) => {
  return (
    <div className="flex w-1/2 min-w-96 flex-col items-center space-y-4 rounded-xl border-slate-700 p-8">
      <div className="h-16 w-full">
        <BasicButton onClick={onClick}>
          <div className="flex items-center justify-center space-x-4">
            <Image src="/google.svg" alt="google-icon" width={24} height={24} />
            <span className="break-all">{buttonMessage}</span>
          </div>
        </BasicButton>
      </div>
      <Link href={linkPath} className="underline">
        {linkMessage}
      </Link>
    </div>
  );
};

export default AuthTemplate;
