import Link from "next/link";
import { FC } from "react";

const NotFoundPage: FC = () => {
  return (
    <div className="flex size-full flex-col items-center justify-center space-y-2 bg-slate-900 text-slate-500">
      <h1 className="font-mono text-[10rem] font-bold text-slate-700">404</h1>
      <p>お探しのページが見つかりませんでした。</p>
      <p className="underline">
        <Link href="/">ダッシュボードに戻る</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
