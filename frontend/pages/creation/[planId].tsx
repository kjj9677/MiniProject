import { FC, useEffect, useRef, useState } from "react";
import { isEmpty } from "lodash";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";
import Modal from "react-modal";

const BASE_URI = "http://211.197.23.229:3030";
const SCHEDULE_TYPE = ["이동", "식사", "활동", "기타"];

interface ScheduleInput {
  duration: number;
  scheduleTypeId: number;
  title: string;
}

const CreateSchedule: FC = () => {
  const addedSchedulesRef = useRef([]);
  const router = useRouter();
  const planId = +router.query.planId;
  const [startTime, setStartTime] = useState<number>();
  const [inputs, setInputs] = useState<ScheduleInput>({
    duration: undefined,
    scheduleTypeId: 1,
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
      if (data.schedules.length > 0) {
        const newSchedules = data.schedules.sort(
          (a, b) => a.startTime - b.startTime
        );
        setStartTime(
          +newSchedules[newSchedules.length - 1].startTime +
            +newSchedules[newSchedules.length - 1].duration
        );
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

  const onChange = (e: any) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onSelectChange = (e: any) => {
    const { value } = e.target;
    setInputs({
      ...inputs,
      scheduleTypeId: getScheduleTypeId(value),
    });
  };

  const onStartChange = (e: any) => {
    const { value } = e.target;
    setStartTime(value);
  };

  const CREATE_SCHEDULE_TEXT = [
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
    if (isEmpty(title) || isEmpty(duration)) {
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
      startTime: +startTime,
      planId,
    });
    setStartTime(+startTime + Number(duration));
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
        .then(() => router.reload());
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
          {planInfo.schedules
            .sort((a, b) => a.startTime - b.startTime)
            .map(({ id, title, startTime }) => {
              return (
                <ScheduleInfo
                  accessToken={accessToken}
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
                accessToken={accessToken}
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
        <div
          style={{
            columnGap: 12,
            display: "grid",
            gridAutoFlow: "column",
            height: 60,
            placeItems: "center",
          }}
        >
          <p>종류</p>
          <select
            onChange={onSelectChange}
            value={SCHEDULE_TYPE[scheduleTypeId - 1]}
          >
            {SCHEDULE_TYPE.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
        </div>

        {CREATE_SCHEDULE_TEXT.map(
          ({ isNumber, inputTitle, name, placeholder, value }, idx) => (
            <Input
              key={idx}
              name={name}
              onChange={onChange}
              isNumber={isNumber}
              inputTitle={inputTitle}
              placeholder={placeholder}
              value={value}
            />
          )
        )}
        <div
          style={{
            columnGap: 12,
            display: "grid",
            gridAutoFlow: "column",
            height: 60,
            placeItems: "center",
          }}
        >
          <p>시작 시간(분)</p>
          <input
            name="startTime"
            onChange={onStartChange}
            placeholder="ex) 600"
            type="number"
            value={startTime}
          />
        </div>
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
  accessToken: string;
  id: number;
  startTime: number;
  title: string;
}

const ScheduleInfo: FC<ScheduleInfoProps> = ({
  accessToken,
  id,
  startTime,
  title,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
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
          onClick={() => setIsModifyModalOpen(true)}
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
          onClick={() => setIsModalOpen(true)}
        >
          삭제
        </div>
      </div>
      <DeleteModal
        scheduleId={id}
        onClose={() => setIsModalOpen(false)}
        accessToken={accessToken}
        isOpen={isModalOpen}
      />
      <ModifyModal
        scheduleId={id}
        onClose={() => setIsModifyModalOpen(false)}
        accessToken={accessToken}
        isOpen={isModifyModalOpen}
      />
    </div>
  );
};

function getStartTime(startTime: number) {
  return `${Math.floor(startTime / 60)}:${
    startTime % 60 < 10 ? `0${startTime % 60}` : startTime % 60
  }`;
}

function getScheduleTypeId(value: string) {
  if (value === "이동") {
    return 1;
  }

  if (value === "식사") {
    return 2;
  }

  if (value === "활동") {
    return 3;
  }
  return 4;
}

interface ModifyModalProps {
  accessToken: string;
  isOpen: boolean;
  onClose: () => void;
  scheduleId: number;
  // startTime: number;
  // title: string;
  // duration: number;
  // scheduleTypeId: number;
}

const ModifyModal: FC<ModifyModalProps> = ({
  accessToken,
  isOpen,
  onClose,
  scheduleId,
  // startTime,
  // title,
  // duration,
  // scheduleTypeId,
}) => {
  const [startTime, setStartTime] = useState<number>();
  const [inputs, setInputs] = useState<ScheduleInput>({
    duration: undefined,
    scheduleTypeId: 1,
    title: undefined,
  });

  const { duration, scheduleTypeId, title } = inputs;

  const router = useRouter();
  async function modifySchedule() {
    await axios
      .put(
        `${BASE_URI}/schedules/${scheduleId}`,
        {
          duration: +duration,
          scheduleTypeId: +scheduleTypeId,
          title,
          startTime: +startTime,
        },
        toAuthorizetionHeader(accessToken)
      )
      .then(() => router.reload());
  }

  const onChange = (e: any) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onSelectChange = (e: any) => {
    const { value } = e.target;
    setInputs({
      ...inputs,
      scheduleTypeId: getScheduleTypeId(value),
    });
  };

  const onStartChange = (e: any) => {
    const { value } = e.target;
    setStartTime(+value);
  };

  const CREATE_SCHEDULE_TEXT = [
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
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          rowGap: 20,
          position: "absolute",
          height: 730,
          width: 400,
          left: "40%",
          top: "20%",
        }}
      >
        <div
          style={{
            columnGap: 12,
            display: "grid",
            gridAutoFlow: "column",
            height: 60,
            placeItems: "center",
          }}
        >
          <p>종류</p>
          <select
            onChange={onSelectChange}
            value={SCHEDULE_TYPE[scheduleTypeId - 1]}
          >
            {SCHEDULE_TYPE.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
        </div>
        {CREATE_SCHEDULE_TEXT.map(
          ({ isNumber, inputTitle, name, placeholder, value }, idx) => (
            <Input
              key={idx}
              name={name}
              onChange={onChange}
              isNumber={isNumber}
              inputTitle={inputTitle}
              placeholder={placeholder}
              value={value}
            />
          )
        )}
        <div
          style={{
            columnGap: 12,
            display: "grid",
            gridAutoFlow: "column",
            height: 60,
            placeItems: "center",
          }}
        >
          <p>시작 시간(분)</p>
          <input
            name="startTime"
            onChange={onStartChange}
            placeholder="ex) 600"
            type="number"
            value={startTime}
          />
        </div>
        <div style={{ display: "flex", columnGap: 30 }}>
          <div
            style={{
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              height: 30,
              width: 70,
              backgroundColor: "#ebebeb",
            }}
            onClick={modifySchedule}
          >
            확인
          </div>
          <div
            style={{
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              height: 30,
              width: 70,
              backgroundColor: "#ebebeb",
            }}
            onClick={onClose}
          >
            취소
          </div>
        </div>
      </div>
    </Modal>
  );
};

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
        `${BASE_URI}/schedules/${scheduleId}`,
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
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#c9d3dd",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          rowGap: 20,
          position: "absolute",
          height: 130,
          width: 300,
          left: "42%",
          top: "30%",
        }}
      >
        <p>해당 일정을 삭제하시겠습니까?</p>
        <div style={{ display: "flex", columnGap: 30 }}>
          <div
            style={{
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              height: 30,
              width: 70,
              backgroundColor: "#ebebeb",
            }}
            onClick={deleteSchedule}
          >
            확인
          </div>
          <div
            style={{
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              height: 30,
              width: 70,
              backgroundColor: "#ebebeb",
            }}
            onClick={onClose}
          >
            취소
          </div>
        </div>
      </div>
    </Modal>
  );
};
