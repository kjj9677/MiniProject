import { FC, useState } from "react";
import styled from "@emotion/styled";
import Button from "../../src/components/Button";
import Typography from "../../src/components/Typography";
import DeleteModal from "./DeleteModal";
import ModifyModal from "./ModifyModal";

interface ScheduleInfoProps {
  accessToken: string;
  duration: number;
  id: number;
  isEditable?: boolean;
  scheduleTypeId: number;
  startTime: number;
  title: string;
}

const ScheduleInfo: FC<ScheduleInfoProps> = ({
  accessToken,
  duration,
  id,
  isEditable = true,
  scheduleTypeId,
  startTime,
  title,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  return (
    <ScheduleInfoContainer>
      <StartTimeContainer>
        <Typography>{getStartTime(startTime)}</Typography>
      </StartTimeContainer>
      <Slur />
      <StyledDiv>
        <TitleContainer>
          <Typography color="white">{title}</Typography>
        </TitleContainer>
        {isEditable && (
          <EditButtons>
            <EditButton
              color="white"
              onClick={() => setIsModifyModalOpen(true)}
            >
              수정
            </EditButton>
            <EditButton
              color="white"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              삭제
            </EditButton>
            <DeleteModal
              scheduleId={id}
              onClose={() => setIsDeleteModalOpen(false)}
              accessToken={accessToken}
              isOpen={isDeleteModalOpen}
            />
            <ModifyModal
              accessToken={accessToken}
              isOpen={isModifyModalOpen}
              onClose={() => setIsModifyModalOpen(false)}
              prevDuration={duration}
              prevScheduleTypeId={scheduleTypeId}
              prevStartTime={startTime}
              prevTitle={title}
              scheduleId={id}
            />
          </EditButtons>
        )}
      </StyledDiv>
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

const EditButtons = styled.div({
  alignItems: "center",
  columnGap: 8,
  display: "flex",
  justifyContent: "center",
});

const EditButton = styled(Button)({
  "> p": { fontSize: 16 },
  height: 30,
  width: 50,
});

function getStartTime(startTime: number) {
  return `${Math.floor(startTime / 60)}:${
    startTime % 60 < 10 ? `0${startTime % 60}` : startTime % 60
  }`;
}
