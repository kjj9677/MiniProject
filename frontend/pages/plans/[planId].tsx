import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";
import Modal from "react-modal";
import Link from "next/link";

const BASE_URI = "http://211.197.23.229:3031";

const PlanDetail: FC = () => {
  const router = useRouter();
  const planId = +router.query.planId;
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [planInfo, setPlanInfo] = useState<any>();
  const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);

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
        rowGap: 80,
        width: "100vw",
      }}
    >
      <div style={{ columnGap: 130, display: "flex" }}>
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
        <Link href={`/creation/${planInfo.id}`}>
          <a>
            <div
              style={{
                alignItems: "center",
                backgroundColor: "darkgray",
                color: "white",
                cursor: "pointer",
                display: "flex",
                height: 70,
                justifyContent: "center",
                width: 250,
              }}
            >
              일정 수정하기
            </div>
          </a>
        </Link>
      </div>
      <div>
        {planInfo.schedules
          .sort((a, b) => a.startTime - b.startTime)
          .map(({ id, title, startTime }) => {
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
      <Button onClick={() => setIsFriendsListOpen(true)}>공유하기</Button>
      <FriendsList
        accessToken={accessToken}
        isOpen={isFriendsListOpen}
        onClose={() => setIsFriendsListOpen(false)}
        planId={planId}
      />
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

interface FriendsListProps {
  accessToken: string;
  isOpen: boolean;
  onClose: () => void;
  planId: number;
}

const FriendsList: FC<FriendsListProps> = ({
  accessToken,
  isOpen,
  onClose,
  planId,
}) => {
  const [shareTarget, setShareTarget] = useState("");
  const onChange = (e: any) => {
    {
      const { value } = e.target;
      setShareTarget(value);
    }
  };

  async function createShare() {
    if (shareTarget.length === 0) {
      alert("공유하고 싶은 사람을 입력해주세요!");
      console.log(shareTarget);
      return null;
    }

    await axios
      .post(
        `${BASE_URI}/shares`,
        {
          memberKakaoId: shareTarget,
          planId,
        },
        toAuthorizetionHeader(accessToken)
      )
      .then(() => console.log("Success"));
  }

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: { all: "unset" },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.25)", zIndex: 5 },
      }}
    >
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#c9d3dd",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          rowGap: 20,
          position: "absolute",
          height: 300,
          width: 500,
          left: "38%",
          top: "30%",
        }}
      >
        <div style={{ columnGap: 20, display: "flex" }}>
          <p>누구와 공유하시겠습니까?</p>
          <input onChange={onChange} value={shareTarget} />
        </div>
        <Button onClick={createShare}>공유하기</Button>
      </div>
    </Modal>
  );
};
