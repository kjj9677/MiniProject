// Copyright (C) 2021 Lagood Co. All rights reserved.

import styled from "@emotion/styled";
import { Dispatch, FC, SetStateAction } from "react";
import CreatePlan, { Plan } from "../../pages/creation";
import Typography from "./Typography";

export interface PlanInputFormProps {
  createPlan: () => void;
  inputs: Plan;
  isFirst: boolean;
  isLast: boolean;
  name: string;
  question: string;
  setInputs: Dispatch<SetStateAction<Plan>>;
  setStage: Dispatch<SetStateAction<number>>;
  unit: string;
  value: string | number;
}

const PlanInputForm: FC<PlanInputFormProps> = ({
  createPlan,
  inputs,
  isFirst,
  isLast,
  name,
  question,
  setInputs,
  setStage,
  unit,
  value,
}) => {
  const onChange = (e: any) => {
    {
      const { value, name } = e.target;
      setInputs({
        ...inputs,
        [name]: value,
      });
    }
  };

  return (
    <InputFormContainer>
      <Typography size="24">{question}</Typography>
      <StyledInput
        name={name}
        onChange={onChange}
        spellCheck={false}
        value={value}
      />
      <InputFormButtons
        createPlan={createPlan}
        isFirst={isFirst}
        isLast={isLast}
        setStage={setStage}
      />
    </InputFormContainer>
  );
};

export default PlanInputForm;

const InputFormButtons: FC<
  Pick<PlanInputFormProps, "createPlan" | "isFirst" | "isLast" | "setStage">
> = ({ createPlan, isFirst, isLast, setStage }) => {
  return (
    <ButtonsContainer>
      <StyledButton
        onClick={() => (isLast ? createPlan() : setStage((prev) => prev + 1))}
      >
        <Typography color="white">
          {isLast ? "세부 일정 추가하기" : "다음 단계로 넘어가기"}
        </Typography>
      </StyledButton>
      {!isFirst && (
        <Typography
          color="black"
          onClick={() => setStage((prev) => prev - 1)}
          size="14"
          style={{
            cursor: "pointer",
            textDecoration: "underline 2px solid",
            textUnderlineOffset: 6,
          }}
        >
          이전 단계로 돌아가기
        </Typography>
      )}
    </ButtonsContainer>
  );
};

const ButtonsContainer = styled.div({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  height: 80,
  rowGap: 10,
});

const InputFormContainer = styled.div({
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 5,
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
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
