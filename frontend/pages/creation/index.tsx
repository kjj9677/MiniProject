import { FC, useState } from "react";
import { isEmpty } from "lodash";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";
import PlanInputForm from "../../src/components/PlanInputForm";
import styled from "@emotion/styled";

const BASE_URI = "http://211.197.23.229:3031";

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
  function checkAreInputsValid() {
    if (isEmpty(destination) || isEmpty(period) || isEmpty(title)) {
      alert("빈 항목이 있습니다!");
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

  const PLAN_INPUT_VARIABLES = [
    {
      isNumber: false,
      name: "destination",
      question: "1. 어디로 떠나시나요?",
      unit: "",
      value: destination,
    },
    {
      isNumber: true,
      name: "period",
      question: "2. 며칠 동안 다녀오시나요?(일)",
      unit: "(일)",
      value: period,
    },
    {
      isNumber: false,
      name: "title",
      question: "3. 이번 여행에 제목을 붙인다면?",
      unit: "",
      value: title,
    },
  ];
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
      <PlanInputFormsContainer>
        <div style={{ display: "flex", marginLeft: (stage - 1) * -400 }}>
          {PLAN_INPUT_VARIABLES.map(({ name, question, unit, value }, idx) => (
            <PlanInputForm
              createPlan={createPlan}
              inputs={inputs}
              isFirst={idx === 0}
              isLast={idx === PLAN_INPUT_VARIABLES.length - 1}
              key={name}
              name={name}
              question={question}
              setInputs={setInputs}
              setStage={setStage}
              unit={unit}
              value={value}
            />
          ))}
        </div>
      </PlanInputFormsContainer>
    </div>
  );
};

export default CreatePlan;

const PlanInputFormsContainer = styled.div({
  display: "flex",
  overflow: "hidden",
  width: 400,
});
