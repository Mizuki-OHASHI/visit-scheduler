import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import { useMe } from "@/api/useMe";
import AuthTemplate from "@/app-components/auth/template";
import BasicButton from "@/components/button/basic-button";
import BasicInput from "@/components/input/basic-input";
import { fireAuth } from "@/config/firebase";
import { AppUserBase, appUserBaseSchema } from "@/schema/user";

const provider = new GoogleAuthProvider();

const SignupPage: FC = () => {
  const router = useRouter();
  const { createMe } = useMe();

  const [appUser, setAppUser] = useState<AppUserBase | null>(null);

  const googleLoginHandler = () => {
    signInWithPopup(fireAuth, provider)
      .then(({ user }) => {
        const newAppUser = appUserBaseSchema.parse({
          email: user.email,
          user_name: user.displayName ?? "",
          display_name: "",
          role: "user",
        });
        setAppUser(newAppUser);
      })
      .catch((error) => {
        console.error(error);
        alert("認証に失敗しました。");
      });
  };

  const signupHandler = () => {
    if (!appUser) {
      console.error("appUser or userCtx is null.");
      return;
    }
    if (appUser.display_name.length === 0) {
      alert("表示名を入力してください。");
      return;
    }
    createMe
      .trigger({ data: appUser })
      .then(() => {
        alert("アカウントを作成しました。");
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
        alert("アカウントの作成に失敗しました。");
      });
  };

  return !appUser ? (
    <AuthTemplate
      buttonMessage="Google アカウントで登録"
      onClick={googleLoginHandler}
      linkMessage="ログインはこちら"
      linkPath="/auth/login"
    />
  ) : (
    <div className="flex size-full w-1/2 min-w-96 flex-col items-center justify-center space-y-4">
      <h1>アカウントを作成します。</h1>
      <p>Email</p>
      <div className="h-10 w-full">
        <BasicInput value={appUser.email} />
      </div>
      <p>Google アカウント名</p>
      <div className="h-10 w-full">
        <BasicInput value={appUser.user_name} />
      </div>
      <p>表示名</p>
      <div className="h-10 w-full">
        <BasicInput
          value={appUser.display_name}
          onChange={(v) => setAppUser({ ...appUser, display_name: v })}
          placeholder="表示名"
        />
      </div>
      <div className="h-16 w-32 pt-4">
        <BasicButton onClick={signupHandler}>登録</BasicButton>
      </div>
    </div>
  );
};

export default SignupPage;
