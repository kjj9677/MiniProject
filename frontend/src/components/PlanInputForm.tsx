// Copyright (C) 2021 Lagood Co. All rights reserved.

import styled from "@emotion/styled";
import { Dispatch, FC, SetStateAction } from "react";
import { Plan } from "../../pages/creation";
import Typography from "./Typography";

export interface PlanInputFormProps {
  inputs: Plan;
  setInputs: Dispatch<SetStateAction<Plan>>;
  setStage: Dispatch<SetStateAction<number>>;
  stage: number;
}

const PlanInputForm: FC<PlanInputFormProps> = ({
  inputs,
  setInputs,
  setStage,
  stage,
}) => {
  const { destination, period, title } = inputs;
  const PLAN_INPUT_VARIABLES = [
    {
      isNumber: false,
      question: "1. 어디로 떠나시나요?",
      name: "destination",
      value: destination,
    },
    {
      isNumber: true,
      question: "2. 며칠 동안 다녀오시나요?",
      name: "period",
      value: period,
    },
    {
      isNumber: false,
      question: "3. 이번 여행에 제목을 붙인다면?",
      name: "title",
      value: title,
    },
  ];

  const onChange = (e: any) => {
    {
      const { value, name } = e.target;
      setInputs({
        ...inputs,
        [PLAN_INPUT_VARIABLES[stage - 1].name]: value,
      });
    }
  };

  return (
    <InputFormContainer>
      <Typography size="24">
        {PLAN_INPUT_VARIABLES[stage - 1].question}
      </Typography>
      <StyledInput
        onChange={onChange}
        value={PLAN_INPUT_VARIABLES[stage - 1].value}
      />
      <InputFormButtons
        isFirst={stage === 1}
        isLast={stage === PLAN_INPUT_VARIABLES.length}
        setStage={setStage}
      />
    </InputFormContainer>
  );
};

export default PlanInputForm;

interface InputFormButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  setStage: Dispatch<SetStateAction<number>>;
}

const InputFormButtons: FC<InputFormButtonsProps> = ({
  isFirst,
  isLast,
  setStage,
}) => {
  if (isFirst) {
    return (
      <StyledButton onClick={() => setStage((prev) => prev + 1)}>
        <Typography color="white">다음</Typography>
      </StyledButton>
    );
  } else if (isLast) {
    return (
      <StyledButton>
        <Typography color="white">세부 일정 추가하기</Typography>
      </StyledButton>
    );
  }
  return (
    <ButtonsContainer>
      <StyledButton onClick={() => setStage((prev) => prev - 1)}>
        <Typography color="white">이전</Typography>
      </StyledButton>
      <StyledButton onClick={() => setStage((prev) => prev + 1)}>
        <Typography color="white">다음</Typography>
      </StyledButton>
    </ButtonsContainer>
  );
};

const ButtonsContainer = styled.div({ display: "flex", columnGap: 20 });

const InputFormContainer = styled.div({
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 5,
  display: "flex",
  flexDirection: "column",
  height: 300,
  justifyContent: "center",
  rowGap: 30,
  width: 400,
});

const StyledInput = styled.input({
  backgroundColor: "white",
  border: "solid 3px black",
  borderRadius: 15,
  fontSize: 20,
  fontFamily: "Wind",
  fontWeight: 700,
  height: 50,
  paddingLeft: 16,
  paddingRight: 16,
  width: 300,
});

const StyledButton = styled.button({
  all: "unset",
  ": disabled": {
    backgroundColor: "#D3D4D8",
    cursor: "default",
  },
  alignItems: "center",
  backgroundColor: "black",
  borderRadius: 15,
  boxSizing: "border-box",
  cursor: "pointer",
  display: "flex",
  height: 50,
  justifyContent: "center",
  width: 300,
});
