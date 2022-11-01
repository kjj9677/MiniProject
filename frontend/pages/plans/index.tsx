import { FC, useEffect, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import axios from "axios";
import { getPeriodText, toAuthorizetionHeader } from "../../utils";
import { BASE_API_URI } from "../../const";
import Button from "../../src/components/Button";
import PlanInfo from "../../src/components/PlanInfo";

const Plans: FC = () => {
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [planList, setPlanList] = useState<any[]>();

  useEffect(() => {
    async function getPlanList(accessToken: string) {
      const { data } = await axios.get(
        `${BASE_API_URI}/plans`,
        toAuthorizetionHeader(accessToken)
      );
      setPlanList(data);
    }

    setAccessToken(localStorage.getItem("accessToken"));
    if (accessToken) {
      getPlanList(accessToken);
    }
    isLoading && setIsLoading(false);
  }, [accessToken, isLoading]);
  if (isLoading) {
    return <div />;
  }
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        rowGap: 30,
        width: "100vw",
      }}
    >
      <Button color="white">여행 계획표 목록</Button>
      {planList &&
        planList.map(({ id, destination, period, title }) => (
          <PlanInfo
            key={id}
            id={id}
            destination={destination}
            period={period}
            title={title}
          />
        ))}

      <Link href="/creation">
        <a>
          <Button color="white">+ 새 계획표 만들기</Button>
        </a>
      </Link>
    </div>
  );
};

export default Plans;
