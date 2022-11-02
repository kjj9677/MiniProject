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
            .map(({ id, title, startTime }) => {
              return (
                <ScheduleInfo
                  accessToken={accessToken}
                  key={id}
                  id={id}
                  title={title}
                  startTime={getStartTime(startTime)}
                />
              );
            })}
          {addedSchedules.map(({ id, title, startTime }: any) => (
            <ScheduleInfo
              accessToken={accessToken}
              key={id}
              id={id}
              title={title}
              startTime={getStartTime(startTime)}
            />
          ))}
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
  columnGap: 400,
  height: "100vh",
  justifyContent: "center",
  width: "100vw",
});

function getStartTime(startTime: number) {
  return `${Math.floor(startTime / 60)}:${
    startTime % 60 < 10 ? `0${startTime % 60}` : startTime % 60
  }`;
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

// const ModifyModal: FC<ModifyModalProps> = ({
//   accessToken,
//   isOpen,
//   onClose,
//   scheduleId,
//   // startTime,
//   // title,
//   // duration,
//   // scheduleTypeId,
// }) => {
//   const [startTime, setStartTime] = useState<number>();
//   const [inputs, setInputs] = useState<ScheduleInput>({
//     duration: undefined,
//     scheduleType: "이동",
//     title: undefined,
//   });

//   const { duration, scheduleType, title } = inputs;

//   const router = useRouter();
//   async function modifySchedule() {
//     await axios
//       .put(
//         `${BASE_API_URI}/schedules/${scheduleId}`,
//         {
//           duration: +duration,
//           scheduleTypeId: 1,
//           title,
//           startTime: +startTime,
//         },
//         toAuthorizetionHeader(accessToken)
//       )
//       .then(() => router.reload());
//   }

//   const onChange = (e: any) => {
//     const { value, name } = e.target;
//     setInputs({
//       ...inputs,
//       [name]: value,
//     });
//   };

//   // const onSelectChange = (e: any) => {
//   //   const { value } = e.target;
//   //   setInputs({
//   //     ...inputs,
//   //     scheduleTypeId: getScheduleTypeId(value),
//   //   });
//   // };

//   // const onStartChange = (e: any) => {
//   //   const { value } = e.target;
//   //   setStartTime(+value);
//   // };

//   const CREATE_SCHEDULE_TEXT = [
//     {
//       isNumber: false,
//       inputTitle: "내용",
//       name: "title",
//       placeholder: "ex) 강릉버스터미널로 이동",
//       value: title,
//     },

//     {
//       isNumber: true,
//       inputTitle: "소요 시간(분)",
//       name: "duration",
//       placeholder: "ex) 150",
//       value: duration,
//     },
//   ];

//   return (
//     <Modal
//       ariaHideApp={false}
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       style={{
//         content: { all: "unset" },
//         overlay: { backgroundColor: "rgba(0, 0, 0, 0.25)", zIndex: 5 },
//       }}
//     >
//       {/* <div
//         style={{
//           alignItems: "center",
//           backgroundColor: "white",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           rowGap: 20,
//           position: "absolute",
//           height: 730,
//           width: 400,
//           left: "40%",
//           top: "20%",
//         }}
//       >
//         <div
//           style={{
//             columnGap: 12,
//             display: "grid",
//             gridAutoFlow: "column",
//             height: 60,
//             placeItems: "center",
//           }}
//         >
//           <p>종류</p>
//           <select
//             onChange={onSelectChange}
//             value={SCHEDULE_TYPE[scheduleTypeId - 1]}
//           >
//             {SCHEDULE_TYPE.map((e) => {
//               return <option key={e}>{e}</option>;
//             })}
//           </select>
//         </div>
//         {CREATE_SCHEDULE_TEXT.map(
//           ({ isNumber, inputTitle, name, placeholder, value }, idx) => (
//             <Input
//               key={idx}
//               name={name}
//               onChange={onChange}
//               isNumber={isNumber}
//               inputTitle={inputTitle}
//               placeholder={placeholder}
//               value={value}
//             />
//           )
//         )}
//         <div
//           style={{
//             columnGap: 12,
//             display: "grid",
//             gridAutoFlow: "column",
//             height: 60,
//             placeItems: "center",
//           }}
//         >
//           <p>시작 시간(분)</p>
//           <input
//             name="startTime"
//             onChange={onStartChange}
//             placeholder="ex) 600"
//             type="number"
//             value={startTime}
//           />
//         </div>
//         <div style={{ display: "flex", columnGap: 30 }}>
//           <div
//             style={{
//               cursor: "pointer",
//               display: "grid",
//               placeItems: "center",
//               height: 30,
//               width: 70,
//               backgroundColor: "#ebebeb",
//             }}
//             onClick={modifySchedule}
//           >
//             확인
//           </div>
//           <div
//             style={{
//               cursor: "pointer",
//               display: "grid",
//               placeItems: "center",
//               height: 30,
//               width: 70,
//               backgroundColor: "#ebebeb",
//             }}
//             onClick={onClose}
//           >
//             취소
//           </div>
//         </div>
//       </div> */}
//     </Modal>
//   );
// };

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
