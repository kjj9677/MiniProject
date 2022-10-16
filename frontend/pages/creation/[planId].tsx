import { FC, useRef, useState } from "react";
import { isEmpty } from "lodash";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";

const BASE_URI = "http://localhost:3000";

interface ScheduleInput {
  duration: number;
  scheduleTypeId: number;
  title: string;
}

const CreateSchedule: FC = () => {
  const addedSchedulesRef = useRef([]);
  const router = useRouter();
  const planId = +router.query.planId;
  const [startTime, setStartTime] = useState<number>(600);
  const [inputs, setInputs] = useState<ScheduleInput>({
    duration: undefined,
    scheduleTypeId: undefined,
    title: undefined,
  });

  const { duration, scheduleTypeId, title } = inputs;

  const onChange = (e: any) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const CREATE_SCHEDULE_TEXT = [
    {
      isNumber: true,
      inputTitle: "종류",
      name: "scheduleTypeId",
      placeholder: "ex) 1",
      value: scheduleTypeId,
    },
    {
      isNumber: false,
      inputTitle: "내용",
      name: "title",
      placeholder: "ex) 강릉버스터미널로 이동",
      value: title,
    },

    {
      isNumber: true,
      inputTitle: "소요 시간(분)",
      name: "duration",
      placeholder: "ex) 150",
      value: duration,
    },
  ];

  function onReset() {
    setInputs({
      duration: 0,
      scheduleTypeId: 0,
      title: "",
    });
  }

  function checkAreInputsValid() {
    if (isEmpty(scheduleTypeId) || isEmpty(title) || isEmpty(duration)) {
      alert("빈 항목이 있습니다!");
      return false;
    }

    if (Number(duration) === 0) {
      alert("유효하지 않은 기간입니다.");
      return false;
    }

    return true;
  }

  async function addSchedule() {
    if (!checkAreInputsValid()) {
      return null;
    }

    addedSchedulesRef.current.push({
      title,
      duration: +duration,
      scheduleTypeId: +scheduleTypeId,
      startTime,
      planId,
    });
    setStartTime(startTime + Number(duration));
    onReset();
  }

  function createSchedule() {
    addedSchedulesRef.current.map(async (addedSchedule) => {
      await axios
        .post(
          `${BASE_URI}/schedules`,
          addedSchedule,
          toAuthorizetionHeader(localStorage.getItem("accessToken"))
        )
        .then(() => console.log("success"));
    });
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
      {CREATE_SCHEDULE_TEXT.map(
        ({ isNumber, inputTitle, name, placeholder, value }) => (
          <Input
            key={name}
            name={name}
            onChange={onChange}
            isNumber={isNumber}
            inputTitle={inputTitle}
            placeholder={placeholder}
            value={value}
          />
        )
      )}
      <Button onClick={addSchedule}>세부 일정 추가하기</Button>
      <Button onClick={createSchedule}>저장하기</Button>
    </div>
  );
};

export default CreateSchedule;

interface InputProps {
  inputTitle: string;
  isNumber: boolean;
  name: string;
  onChange: any;
  placeholder: string;
  value: any;
}

const Input: FC<InputProps> = ({
  isNumber,
  name,
  onChange,
  placeholder,
  inputTitle,
  value,
}) => {
  return (
    <div
      style={{
        columnGap: 12,
        display: "grid",
        gridAutoFlow: "column",
        height: 60,
        placeItems: "center",
      }}
    >
      <p>{inputTitle}</p>
      <input
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={isNumber ? "number" : "text"}
        value={value}
      />
    </div>
  );
};

const Button = styled.button(() => ({
  all: "unset",
  alignItems: "center",
  backgroundColor: "yellow",
  display: "flex",
  justifyContent: "center",
  height: 70,
  width: 250,
}));
