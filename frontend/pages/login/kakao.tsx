import { FC, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { BASE_API_URI, BASE_FRONTEND_URI } from "../../const";

async function getToken(code: string | string[]) {
  const data = await axios
    .post(`${BASE_API_URI}/auth/login/kakao?code=${code}`)
    .then(({ data }) => data);

  localStorage.setItem("accessToken", data.accessToken);
}

const Kakao: FC = () => {
  const router = useRouter();
  const {
    query: { code },
  } = router;

  useEffect(() => {
    if (router.isReady && !code) {
      router.push("/");
    }

    if (code) {
      getToken(code).then(() =>
        router.push(`${BASE_FRONTEND_URI}/login/kakao`)
      );
    }
  }, [router, code]);

  return (
    <div
      style={{
        display: "grid",
        height: "100vh",
        placeItems: "center",
        width: "100vw",
      }}
    >
      로그인 중입니다.
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
