import { FC, useState } from "react";
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
import ScheduleInput from "../../src/components/ScheduleInput";
import Button from "./Button";

const SCHEDULE_TYPE = ["이동", "식사", "활동", "휴식", "기타"];
interface ScheduleInput {
  duration: string;
  scheduleType: string;
  startTime: { hour: string; minute: string };
  title: string;
}
interface ModifyModalProps {
  accessToken: string;
  isOpen: boolean;
  onClose: () => void;
  scheduleId: number;
  prevStartTime: number;
  prevTitle: string;
  prevDuration: number;
  prevScheduleTypeId: number;
}

const ModifyModal: FC<ModifyModalProps> = ({
  accessToken,
  isOpen,
  onClose,
  prevDuration,
  prevScheduleTypeId,
  prevStartTime,
  prevTitle,
  scheduleId,
}) => {
  const router = useRouter();
  const [inputs, setInputs] = useState<ScheduleInput>({
    duration: String(prevDuration),
    scheduleType: SCHEDULE_TYPE[prevScheduleTypeId],
    startTime: getFormedStartTime(prevStartTime),
    title: prevTitle,
  });

  const { duration, scheduleType, startTime, title } = inputs;

  const onChange = (e: any, isNumber: boolean, isStartTime: boolean) => {
    const { value, name } = e.target;
    const newValue = isNumber ? value.replace(/[^0-9]/g, "") : value;
    if (isStartTime) {
      setInputs({
        ...inputs,
        startTime: { ...startTime, [name]: newValue },
      });
    } else
      setInputs({
        ...inputs,
        [name]: newValue,
      });
  };

  const CREATE_SCHEDULE_VARIABLES = [
    {
      inputTitle: "종류",
      isNumber: false,
      isSelectType: true,
      isStartTime: false,
      name: "scheduleType",
      placeholder: "",
      value: scheduleType,
    },
    {
      inputTitle: "제목",
      isNumber: false,
      isSelectType: false,
      isStartTime: false,
      name: "title",
      placeholder: "ex)강릉버스터미널로 이동",
      value: title,
    },
    {
      inputTitle: "시작 시간",
      isNumber: true,
      isSelectType: false,
      isStartTime: true,
      name: "startTime",
      placeholder: "",
      value: startTime,
    },
    {
      inputTitle: "소요 시간(분)",
      isNumber: true,
      isSelectType: false,
      isStartTime: false,
      name: "duration",
      placeholder: "ex)150",
      value: duration,
    },
  ];

  function checkAreInputsValid() {
    if (isEmpty(title) || isEmpty(duration)) {
      alert("빈 항목이 있습니다!");
      return false;
    }
    return true;
  }

  async function modifySchedule() {
    if (!checkAreInputsValid) {
      return null;
    }
    await axios
      .put(
        `${BASE_API_URI}/schedules/${scheduleId}`,
        {
          title,
          duration: +duration,
          scheduleTypeId: getScheduleTypeIdByString(scheduleType),
          startTime: +startTime.hour * 60 + +startTime.minute,
        },
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
      <StyledDiv
        style={{
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 24,
          rowGap: 24,
        }}
      >
        {CREATE_SCHEDULE_VARIABLES.map(
          (
            {
              isNumber,
              isSelectType,
              isStartTime,
              inputTitle,
              name,
              placeholder,
              value,
            },
            idx
          ) => (
            <ScheduleInput
              key={idx}
              name={name}
              onChange={onChange}
              isNumber={isNumber}
              isSelectType={isSelectType}
              isStartTime={isStartTime}
              inputTitle={inputTitle}
              placeholder={placeholder}
              value={value}
            />
          )
        )}
        <ModifyButton color="white" onClick={modifySchedule}>
          수정하기
        </ModifyButton>
      </StyledDiv>
    </Modal>
  );
};

export default ModifyModal;

const StyledDiv = styled.div({
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 5,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  left: "50%",
  padding: 24,
  position: "absolute",
  rowGap: 24,
  top: "50%",
  transform: "translateX(-50%) translateY(-50%)",
});

const ModifyButton = styled(Button)({
  border: "solid 3px black",
  height: 60,
  width: 200,
});
