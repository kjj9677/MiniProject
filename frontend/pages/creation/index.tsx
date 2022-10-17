import { FC, useState } from "react";
import { isEmpty } from "lodash";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";

const BASE_URI = "http://localhost:3000";

interface Plan {
  destination: string;
  period: number;
  title: string;
}

const CreatePlan: FC = () => {
  const router = useRouter();
  const [inputs, setInputs] = useState<Plan>({
    destination: undefined,
    period: undefined,
    title: undefined,
  });

  const { destination, title, period } = inputs;

  const onChange = (e: any) => {
    {
      const { value, name } = e.target;
      setInputs({
        ...inputs,
        [name]: value,
      });
    }
  };

  const CREATE_PLAN_TEXT = [
    {
      isNumber: false,
      question: "1. 어디로 떠나시나요?",
      name: "destination",
      placeholder: "ex) 강릉",
      value: destination,
    },
    {
      isNumber: true,
      question: "2. 며칠 동안 다녀오시나요?",
      name: "period",
      placeholder: "ex) 3",
      value: period,
    },
    {
      isNumber: false,
      question: "3. 이번 여행에 제목을 붙인다면?",
      name: "title",
      placeholder: "ex) OO과 OO의 강릉여행",
      value: title,
    },
  ];

  function checkAreInputsValid() {
    if (isEmpty(destination) || isEmpty(period) || isEmpty(title)) {
      alert("빈 항목이 있습니다!");
      return false;
    }

    if (Number(period) === 0) {
      alert("유효하지 않은 기간입니다.");
      return false;
    }

    return true;
  }

  async function createPlan() {
    if (!checkAreInputsValid()) {
      return null;
    }

    await axios
      .post(
        `${BASE_URI}/plans`,
        {
          destination,
          period: Number(period),
          title,
        },
        toAuthorizetionHeader(localStorage.getItem("accessToken"))
      )
      .then((res) => router.push(`/creation/${res.data.id}`));
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
      {CREATE_PLAN_TEXT.map(
        ({ isNumber, name, placeholder, question, value }) => (
          <PlanInput
            key={name}
            name={name}
            onChange={onChange}
            isNumber={isNumber}
            placeholder={placeholder}
            question={question}
            value={value}
          />
        )
      )}
      <Button onClick={createPlan}>Plan 생성하고 세부 일정 추가하기</Button>
    </div>
  );
};

export default CreatePlan;

interface PlanInputProps {
  isNumber: boolean;
  name: string;
  onChange: any;
  placeholder: string;
  question: string;
  value: any;
}

const PlanInput: FC<PlanInputProps> = ({
  isNumber,
  name,
  onChange,
  placeholder,
  question,
  value,
}) => {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
      }}
    >
      <p>{question}</p>
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
  width: 350,
}));
