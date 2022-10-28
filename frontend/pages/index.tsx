import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Button from "../src/components/Button";
import { REDIRECT_URI } from "../const";

const Main: FC = () => {
  const router = useRouter();
  function loginWithKakao() {
    window.Kakao.Auth.authorize({
      redirectUri: REDIRECT_URI,
    });
  }

  function logOut() {
    localStorage.removeItem("accessToken");
    router.reload();
  }

  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  if (accessToken) {
    return (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          rowGap: 50,
          width: "100vw",
        }}
      >
        <Link href="/creation">
          <a>
            <Button color="white">새 계획표 만들기</Button>
          </a>
        </Link>
        <Link href="/plans">
          <a>
            <Button color="white">이전 계획표 보기</Button>
          </a>
        </Link>
        <Button color="white" onClick={logOut}>
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        height: "100vh",
        placeItems: "center",
        width: "100vw",
      }}
    >
      <Button onClick={loginWithKakao}>카카오로 로그인하기</Button>
    </div>
  );
};

export default Main;
