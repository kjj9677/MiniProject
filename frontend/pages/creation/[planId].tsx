import { FC, useEffect, useRef, useState } from "react";
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

  const [planInfo, setPlanInfo] = useState<any>();
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const { duration, scheduleTypeId, title } = inputs;

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
          toAuthorizetionHeader(accessToken)
        )
        .then(() => console.log("success"));
    });
  }

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        columnGap: 500,
        height: "100vh",
        justifyContent: "center",
        width: "100vw",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          rowGap: 30,
        }}
      >
        <div
          style={{
            alignItems: "center",
            backgroundColor: "darkgray",
            color: "white",
            display: "flex",
            height: 50,
            justifyContent: "center",
            width: 150,
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
          {addedSchedulesRef.current.map(({ id, title, startTime }) => {
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
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          rowGap: 50,
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

function getStartTime(startTime: number) {
  return `${Math.floor(startTime / 60)}:${
    startTime % 60 < 10 ? `0${startTime % 60}` : startTime % 60
  }`;
}
