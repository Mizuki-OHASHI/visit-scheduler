import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FC } from "react";

import AuthTemplate from "@/app-components/auth/template";
import { fireAuth } from "@/config/firebase";

const provider = new GoogleAuthProvider();

const LoginPage: FC = () => {
  const router = useRouter();

  const loginHandler = () => {
    signInWithPopup(fireAuth, provider)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
        alert("ログインに失敗しました。");
      });
  };

  return (
    <AuthTemplate
      buttonMessage="Google アカウントでログイン"
      onClick={loginHandler}
      linkMessage="新規登録はこちら"
      linkPath="/auth/signup"
    />
  );
};

export default LoginPage;
