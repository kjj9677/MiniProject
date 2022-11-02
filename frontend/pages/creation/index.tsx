import { FC, useState } from "react";
import { isEmpty } from "lodash";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { useRouter } from "next/router";
import PlanInput from "../../src/components/PlanInput";
import styled from "@emotion/styled";
import { BASE_API_URI } from "../../const";

export interface Plan {
  destination: string;
  period: string;
  title: string;
}

const CreatePlan: FC = () => {
  const router = useRouter();
  const [stage, setStage] = useState<number>(1);
  const [inputs, setInputs] = useState<Plan>({
    destination: "",
    period: "",
    title: "",
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
      return;
    }

    await axios
      .post(
        `${BASE_API_URI}/plans`,
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
      value: destination,
    },
    {
      isNumber: true,
      name: "period",
      question: "2. 며칠 동안 다녀오시나요?(일)",
      value: period,
    },
    {
      isNumber: false,
      name: "title",
      question: "3. 이번 여행에 제목을 붙인다면?",
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
      <PlanInputsContainer>
        <div style={{ display: "flex", marginLeft: (stage - 1) * -400 }}>
          {PLAN_INPUT_VARIABLES.map(
            ({ isNumber, name, question, value }, idx) => (
              <PlanInput
                createPlan={createPlan}
                inputs={inputs}
                isFirst={idx === 0}
                isFocused={idx === stage - 1}
                isLast={idx === PLAN_INPUT_VARIABLES.length - 1}
                isNumber={isNumber}
                key={name}
                name={name}
                question={question}
                setInputs={setInputs}
                setStage={setStage}
                value={value}
              />
            )
          )}
        </div>
      </PlanInputsContainer>
    </div>
  );
};

export default CreatePlan;

const PlanInputsContainer = styled.div({
  display: "flex",
  overflow: "hidden",
  width: 400,
});
