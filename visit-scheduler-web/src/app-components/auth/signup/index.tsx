import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FC } from "react";

import AuthTemplate from "@/app-components/auth/template";
import { fireAuth } from "@/config/firebase";

const provider = new GoogleAuthProvider();

const SignupPage: FC = () => {
  const router = useRouter();

  const signupHandler = () => {
    signInWithPopup(fireAuth, provider)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
        alert("認証に失敗しました。");
      });
  };

  return (
    <AuthTemplate
      buttonMessage="Google アカウントで登録"
      onClick={signupHandler}
      linkMessage="ログインはこちら"
      linkPath="/auth/login"
    />
  );
};

export default SignupPage;
