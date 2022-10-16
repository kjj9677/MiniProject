import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";

const BASE_URI = "http://localhost:3000";

const PlanDetail: FC = () => {
  const router = useRouter();
  const planId = +router.query.planId;
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [planInfo, setPlanInfo] = useState<any>();

  async function createShare() {}

  useEffect(() => {
    async function getPlanDetail(accessToken: string, planId: number) {
      const { data } = await axios.get(
        `${BASE_URI}/plans/${planId}`,
        toAuthorizetionHeader(accessToken)
      );
      setPlanInfo(data);
    }

    setAccessToken(localStorage.getItem("accessToken"));
    if (accessToken && planId) {
      getPlanDetail(accessToken, planId);
      setIsLoading(false);
    }
  }, [accessToken, planId]);

  if (!planInfo || isLoading) {
    return null;
  }

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
        {planInfo.title}
      </div>
      <div>
        {planInfo.schedules.map(({ id, title, startTime }) => {
          return (
            <ScheduleInfo
              key={id}
              id={id}
              title={title}
              startTime={startTime}
            />
          );
        })}
      </div>
      <Button>공유하기</Button>
    </div>
  );
};

export default PlanDetail;

interface ScheduleInfoProps {
  id: number;
  startTime: number;
  title: string;
}

const ScheduleInfo: FC<ScheduleInfoProps> = ({ id, startTime, title }) => {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#ebebeb",
          color: "black",
          display: "flex",
          flexDirection: "column",
          height: 30,
          justifyContent: "center",
          position: "relative",
          width: 100,
        }}
      >
        <p>{getStartTime(startTime)}</p>
      </div>
      <div
        style={{
          alignItems: "center",
          backgroundColor: "darkgray",
          height: 55,
          width: 3,
        }}
      />
      <div
        style={{
          alignItems: "center",
          bottom: 10,
          columnGap: 15,
          left: 60,
          display: "flex",
          justifyContent: "center",
          position: "absolute",
        }}
      >
        <div
          style={{
            alignItems: "center",
            backgroundColor: "darkgray",
            color: "white",
            display: "flex",
            height: 30,
            justifyContent: "center",
            width: 200,
          }}
        >
          {title}
        </div>
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#ebebeb",
            color: "black",
            display: "flex",
            height: 30,
            justifyContent: "center",
            width: 100,
          }}
        >
          수정
        </div>
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#ebebeb",
            color: "black",
            display: "flex",
            height: 30,
            justifyContent: "center",
            width: 100,
          }}
        >
          삭제
        </div>
      </div>
    </div>
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

function getStartTime(startTime: number) {
  return `${Math.floor(startTime / 60)}:${
    startTime % 60 < 10 ? `0${startTime % 60}` : startTime % 60
  }`;
}
