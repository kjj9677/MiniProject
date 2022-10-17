import { FC, useEffect, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";

const BASE_URI = "http://localhost:3000";

const Plans: FC = () => {
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [planList, setPlanList] = useState<any[]>();

  useEffect(() => {
    async function getPlanList(accessToken: string) {
      const { data } = await axios.get(
        `${BASE_URI}/plans`,
        toAuthorizetionHeader(accessToken)
      );
      setPlanList(data);
    }

    setAccessToken(localStorage.getItem("accessToken"));
    if (accessToken) {
      getPlanList(accessToken);
    }
    setIsLoading(false);
  }, [accessToken]);
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
      <div
        style={{
          alignItems: "center",
          backgroundColor: "darkgray",
          color: "white",
          display: "flex",
          height: 70,
          justifyContent: "center",
          width: 250,
        }}
      >
        여행계획표 목록
      </div>
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

      <Button>+ 새 계획표 만들기</Button>
    </div>
  );
};

export default Plans;

interface PlanInfoProps {
  destination: string;
  id: number;
  period: number;
  title: string;
}

const PlanInfo: FC<PlanInfoProps> = ({ destination, id, period, title }) => {
  return (
    <Link href={`/plans/${id}`}>
      <a href={`/plans/${id}`}>
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#c9d3dd",
            color: "black",
            display: "flex",
            height: 150,
            justifyContent: "center",
            position: "relative",
            width: 450,
          }}
        >
          <p>{title}</p>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "absolute",
              right: 10,
              rowGap: 10,
              top: 10,
            }}
          >
            <div
              style={{
                alignItems: "center",
                backgroundColor: "gray",
                color: "white",
                display: "flex",
                justifyContent: "center",
                height: 50,
                width: 100,
              }}
            >
              {destination}
            </div>
            <div
              style={{
                alignItems: "center",
                backgroundColor: "gray",
                color: "white",
                display: "flex",
                justifyContent: "center",
                height: 50,
                width: 100,
              }}
            >
              {getPeriodText(period)}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

const Button = styled.button(() => ({
  all: "unset",
  alignItems: "center",
  backgroundColor: "darkgray",
  color: "white",
  display: "flex",
  justifyContent: "center",
  height: 70,
  width: 250,
}));

function getPeriodText(period: number): string {
  if (period === 1) {
    return "당일치기";
  }

  return `${period - 1}박${period}일`;
}
