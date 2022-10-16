import { FC, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import useSWR from "swr";

const BASIC_URI = "http://localhost:3000";

async function getToken(code: string | string[]) {
  const data = await axios
    .post(`${BASIC_URI}/auth/login/kakao?code=${code}`)
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
      getToken(code).then(() => router.push("/login/kakao"));
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
