import { FC, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

const BASIC_URI = "http://localhost:3000";

const Kakao: FC = () => {
  const router = useRouter();
  const {
    query: { code },
  } = router;

  // useEffect(() => {
  //   if (router && !code) {
  //     router.push("/");
  //   }
  // }, [code]);

  async function getToken() {
    const res = await axios.post(`${BASIC_URI}/login/kakao?code=${code}`);
    console.log(res.data);
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
      <KaKaoLoginButton onClick={getToken}>토큰 얻기</KaKaoLoginButton>
    </div>
  );
};

export default Kakao;

const KaKaoLoginButton = styled.button(() => ({
  all: "unset",
  alignItems: "center",
  backgroundColor: "yellow",
  display: "flex",
  justifyContent: "center",
  height: 70,
  width: 250,
}));
