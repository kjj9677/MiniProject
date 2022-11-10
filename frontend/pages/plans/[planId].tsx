import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";
import Modal from "react-modal";
import Link from "next/link";
import { BASE_API_URI } from "../../const";
import Button from "../../src/components/Button";
import ScheduleInfo from "../../src/components/ScheduleInfo";

const PlanDetail: FC = () => {
  const router = useRouter();
  const planId = +router.query.planId;
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [planInfo, setPlanInfo] = useState<any>();
  const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);

  useEffect(() => {
    async function getPlanDetail(accessToken: string, planId: number) {
      const data = await axios
        .get(
          `${BASE_API_URI}/plans/${planId}`,
          toAuthorizetionHeader(accessToken)
        )
        .then((res) => res.data)
        .catch((error) => console.log(error));
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

  const sortedSchedules = planInfo.schedules.sort(
    (a, b) => a.startTime - b.startTime
  );

  return (
    <PlanDetailContainer>
      <div style={{ columnGap: 130, display: "flex" }}>
        <Button color="white">{planInfo.title}</Button>
        <Link href={`/creation/${planInfo.id}`}>
          <a>
            <Button color="white">일정 수정하기</Button>
          </a>
        </Link>
      </div>
      <div>
        {sortedSchedules.map(
          ({ duration, id, title, scheduleTypeId, startTime }, idx) => {
            return (
              <ScheduleInfo
                accessToken={accessToken}
                duration={duration}
                isConnected={
                  idx < sortedSchedules.length - 1 &&
                  startTime + duration === sortedSchedules[idx + 1].startTime
                }
                id={id}
                isEditable={false}
                key={id}
                scheduleTypeId={scheduleTypeId}
                startTime={startTime}
                title={title}
              />
            );
          }
        )}
      </div>
      <Button color="white" onClick={() => setIsFriendsListOpen(true)}>
        공유하기
      </Button>
      <FriendsList
        accessToken={accessToken}
        isOpen={isFriendsListOpen}
        onClose={() => setIsFriendsListOpen(false)}
        planId={planId}
      />
    </PlanDetailContainer>
  );
};

export default PlanDetail;

const PlanDetailContainer = styled.div({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  justifyContent: "center",
  rowGap: 80,
  width: "100vw",
});
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
        `${BASE_API_URI}/shares`,
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
