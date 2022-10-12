import { FC } from "react";
import axios from "axios";
import styled from "@emotion/styled";

const KAKAO_REST_KEY = "db80dea958060d111f015f8da9e4a89c";
const GET_TOKEN_URI = "https://kauth.kakao.com/oauth/token";
const GET_FRIENDS_URI =
  "https://kapi.kakao.com/v1/api/talk/friends?friend_order=nickname&limit=100&order=asc";
const GET_PROFILE_URI = "https://kapi.kakao.com/v1/api/talk/profile";
const GET_USER = "https://kapi.kakao.com/v2/user/me";
const GRANT_TYPE = "authorization_code";
const REDIRECT_URI = "http://localhost:3000";

const ACCESS_TOKEN = "oyAVSg-Ryi3KM3IpSndVtBi51hAVT0bsxX4BpKKrCj10lwAAAYPLWweH";

const Main: FC = () => {
  function loginWithKakao() {
    window.Kakao.Auth.authorize({
      redirectUri: "http://localhost:3000",
    });
  }

  const getToken = async () => {
    const { data } = await axios.post(
      `${GET_TOKEN_URI}?grant_type=${GRANT_TYPE}&client_id=${KAKAO_REST_KEY}&redirect_uri=${REDIRECT_URI}&code=${new URL(
        window.location.href
      ).searchParams.get("code")}`,
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    console.log(data);
  };

  async function getFriends() {
    await axios(GET_USER, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    }).then((res) => console.log(res.data));
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
      <KaKaoLoginButton onClick={getToken}>토큰 얻기</KaKaoLoginButton>
      <KaKaoLoginButton onClick={getFriends}>친구 목록 얻기</KaKaoLoginButton>
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
