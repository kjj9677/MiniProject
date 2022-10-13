import { FC } from "react";
import styled from "@emotion/styled";

const REDIRECT_URI = "http://localhost:3001/login/kakao";

const Main: FC = () => {
  function loginWithKakao() {
    window.Kakao.Auth.authorize({
      redirectUri: REDIRECT_URI,
    });
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
