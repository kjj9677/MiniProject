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
import ScheduleInfo from "../../src/components/ScheduleInfo";

interface ScheduleInput {
  duration: string;
  scheduleType: string;
  startTime: { hour: string; minute: string };
  title: string;
}

const CreateSchedule: FC = () => {
  const [addedSchedules, setAddedSchedules] = useState([]);
  const router = useRouter();
  const planId = +router.query.planId;
  const [inputs, setInputs] = useState<ScheduleInput>({
    duration: "",
    scheduleType: "이동",
    startTime: { hour: "00", minute: "00" },
    title: "",
  });

  const [planInfo, setPlanInfo] = useState<any>();
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const { duration, scheduleType, startTime, title } = inputs;

  useEffect(() => {
    async function getPlanDetail(accessToken: string, planId: number) {
      const { data } = await axios.get(
        `${BASE_API_URI}/plans/${planId}`,
        toAuthorizetionHeader(accessToken)
      );
      setPlanInfo(data);
      if (data.schedules.length > 0) {
        const sortedSchedules = data.schedules.sort(
          (a, b) => a.startTime - b.startTime
        );
        const newStartTime =
          +sortedSchedules[sortedSchedules.length - 1].startTime +
          +sortedSchedules[sortedSchedules.length - 1].duration;
        setInputs({
          ...inputs,
          startTime: getFormedStartTime(newStartTime),
        });
      }
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

  function onReset() {
    setInputs({
      duration: "",
      scheduleType: "이동",
      startTime: getFormedStartTime(
        +startTime.hour * 60 + +startTime.minute + +duration
      ),
      title: "",
    });
  }

  function checkAreInputsValid() {
    if (isEmpty(title) || isEmpty(duration)) {
      alert("빈 항목이 있습니다!");
      return false;
    }
    return true;
  }

  function addSchedule() {
    if (!checkAreInputsValid()) {
      return null;
    }

    setAddedSchedules((prev) => [
      ...prev,
      {
        title,
        duration: +duration,
        scheduleTypeId: getScheduleTypeIdByString(scheduleType),
        startTime: +startTime.hour * 60 + +startTime.minute,
        planId,
      },
    ]);
    onReset();
  }

  function createSchedule() {
    addedSchedules.map(async (addedSchedule) => {
      await axios
        .post(
          `${BASE_API_URI}/schedules`,
          addedSchedule,
          toAuthorizetionHeader(accessToken)
        )
        .then(() => router.reload());
    });
  }

  return (
    <CreateScheduleContainer>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          rowGap: 30,
        }}
      >
        <Button color="white">{planInfo.title}</Button>
        <div>
          {planInfo.schedules
            .sort((a, b) => a.startTime - b.startTime)
            .map(({ duration, id, scheduleTypeId, startTime, title }) => {
              return (
                <ScheduleInfo
                  accessToken={accessToken}
                  duration={duration}
                  id={id}
                  key={id}
                  scheduleTypeId={scheduleTypeId}
                  startTime={startTime}
                  title={title}
                />
              );
            })}
          {addedSchedules.map(
            ({ duration, id, title, scheduleTypeId, startTime }: any) => (
              <ScheduleInfo
                accessToken={accessToken}
                duration={duration}
                key={id}
                id={id}
                scheduleTypeId={scheduleTypeId}
                startTime={startTime}
                title={title}
              />
            )
          )}
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          rowGap: 24,
        }}
      >
        <div
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
        </div>
        <Button color="white" onClick={addSchedule}>
          세부 일정 추가하기
        </Button>
        <Button color="white" onClick={createSchedule}>
          저장하기
        </Button>
      </div>
    </CreateScheduleContainer>
  );
};

export default CreateSchedule;

const CreateScheduleContainer = styled.div({
  alignItems: "center",
  display: "flex",
  columnGap: 300,
  height: "100vh",
  justifyContent: "center",
  width: "100vw",
});
