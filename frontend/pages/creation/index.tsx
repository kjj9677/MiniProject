import { FC, useState } from "react";
import { isEmpty } from "lodash";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";
import Button from "../../src/components/Button";
import PlanInputForm from "../../src/components/PlanInputForm";

const BASE_URI = "http://localhost:3000";

export interface Plan {
  destination: string;
  period: number;
  title: string;
}

const CreatePlan: FC = () => {
  const router = useRouter();
  const [stage, setStage] = useState<number>(1);
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

  console.log(inputs);
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
      <PlanInputForm
        inputs={inputs}
        setInputs={setInputs}
        setStage={setStage}
        stage={stage}
      />
      <Button onClick={createPlan}>세부 일정 추가하기</Button>
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
