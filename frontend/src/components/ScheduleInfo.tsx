import { FC, useEffect, useRef, useState } from "react";
import { isEmpty } from "lodash";
import styled from "@emotion/styled";
import axios from "axios";
import {
  getFormedStartTime,
  getScheduleTypeIdByString,
  toAuthorizetionHeader,
} from "../../utils";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { BASE_API_URI } from "../../const";
import Button from "../../src/components/Button";
import Typography from "../../src/components/Typography";
import ScheduleInput from "../../src/components/ScheduleInput";

interface ScheduleInfoProps {
  accessToken: string;
  id: number;
  startTime: string;
  title: string;
}

const ScheduleInfo: FC<ScheduleInfoProps> = ({
  accessToken,
  id,
  startTime,
  title,
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  return (
    <ScheduleInfoContainer>
      <StartTimeContainer>
        <Typography>{startTime}</Typography>
      </StartTimeContainer>
      <Slur />
      <StyledDiv>
        <TitleContainer>
          <Typography color="white">{title}</Typography>
        </TitleContainer>
        <EditButton color="white">수정</EditButton>
        <EditButton color="white">삭제</EditButton>
      </StyledDiv>
      {/* <DeleteModal
        scheduleId={id}
        onClose={() => setIsModalOpen(false)}
        accessToken={accessToken}
        isOpen={isModalOpen}
      /> */}
      {/* <ModifyModal
        scheduleId={id}
        onClose={() => setIsModifyModalOpen(false)}
        accessToken={accessToken}
        isOpen={isModifyModalOpen}
      /> */}
    </ScheduleInfoContainer>
  );
};

export default ScheduleInfo;

const Slur = styled.div({
  backgroundColor: "white",
  height: 55,
  width: 3,
});

const StyledDiv = styled.div({
  alignItems: "center",
  bottom: 10,
  columnGap: 8,
  left: 60,
  display: "flex",
  justifyContent: "center",
  position: "absolute",
});

const ScheduleInfoContainer = styled.div({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
});

const StartTimeContainer = styled.div({
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 5,
  color: "white",
  display: "flex",
  height: 30,
  justifyContent: "center",
  position: "relative",
  width: 100,
});

const TitleContainer = styled.div({
  alignItems: "center",
  backgroundColor: "black",
  border: "solid 3px white",
  borderRadius: 5,
  color: "white",
  display: "flex",
  height: 35,
  justifyContent: "center",
  width: 200,
});

const EditButton = styled(Button)({
  "> p": { fontSize: 16 },
  height: 30,
  width: 50,
});
