import { FC } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { BASE_API_URI } from "../../const";
import Button from "../../src/components/Button";
import Typography from "../../src/components/Typography";

interface DeleteModalProps {
  accessToken: string;
  isOpen: boolean;
  onClose: () => void;
  scheduleId: number;
}

const DeleteModal: FC<DeleteModalProps> = ({
  accessToken,
  isOpen,
  onClose,
  scheduleId,
}) => {
  const router = useRouter();
  async function deleteSchedule() {
    await axios
      .delete(
        `${BASE_API_URI}/schedules/${scheduleId}`,
        toAuthorizetionHeader(accessToken)
      )
      .then(() => router.reload());
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
      <StyledDiv>
        <Typography size="20">해당 일정을 삭제하시겠습니까?</Typography>
        <ButtonsContainer style={{ display: "flex", columnGap: 30 }}>
          <StyledButton color="white" onClick={deleteSchedule}>
            확인
          </StyledButton>
          <StyledButton color="white" onClick={onClose}>
            취소
          </StyledButton>
        </ButtonsContainer>
      </StyledDiv>
    </Modal>
  );
};

export default DeleteModal;

const StyledDiv = styled.div({
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 5,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  left: "50%",
  padding: "24px 20px",
  position: "absolute",
  rowGap: 24,
  top: "50%",
  transform: "translateX(-50%) translateY(-50%)",
});

const ButtonsContainer = styled.div({ display: "flex", columnGap: 30 });

const StyledButton = styled(Button)({
  "> p": { fontSize: 18 },
  height: 50,
  border: "solid 3px black",
  borderRadius: 5,
  width: 100,
});
