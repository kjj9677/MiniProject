import { FC, useEffect, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

const REDIRECT_URI = "http://localhost:3001/login/kakao";

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
            <KaKaoLoginButton>새 계획표 만들기</KaKaoLoginButton>
          </a>
        </Link>
        <Link href="/plans">
          <a>
            <KaKaoLoginButton>이전 계획표 보기</KaKaoLoginButton>
          </a>
        </Link>
        <KaKaoLoginButton onClick={logOut}>로그아웃</KaKaoLoginButton>
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
      <KaKaoLoginButton onClick={loginWithKakao}>
        카카오톡으로 로그인하기
      </KaKaoLoginButton>
    </div>
  );
};

export default Main;

const KaKaoLoginButton = styled.button(() => ({
  all: "unset",
  alignItems: "center",
  backgroundColor: "yellow",
  display: "flex",
  justifyContent: "center",
  height: 70,
  width: 250,
}));
