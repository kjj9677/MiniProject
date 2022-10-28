// Copyright (C) 2021 Lagood Co. All rights reserved.

import styled from "@emotion/styled";
import { Dispatch, FC, SetStateAction } from "react";
import { isEmpty } from "lodash";
import { Plan } from "../../pages/creation";
import Typography from "./Typography";

export interface PlanInputFormProps {
  createPlan: () => void;
  inputs: Plan;
  isFirst: boolean;
  isLast: boolean;
  isNumber: boolean;
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
  isNumber,
  name,
  question,
  setInputs,
  setStage,
  unit,
  value,
}) => {
  function onChange(e: any) {
    const { value, name } = e.target;
    const newValue = isNumber ? +value.replace(/[^0-9]/g, "") : value;
    setInputs({
      ...inputs,
      [name]: newValue,
    });
  }

  function onKeyUp(e: any) {
    if (e.key === "Enter") {
      if (!isLast) {
        setStage((prev) => prev + 1);
      }
    }
  }

  return (
    <InputFormContainer>
      <Typography size="24">{question}</Typography>
      <StyledInput
        name={name}
        onChange={onChange}
        onKeyUp={onKeyUp}
        spellCheck={false}
        value={value}
      />
      <InputFormButtons
        createPlan={createPlan}
        isFirst={isFirst}
        isLast={isLast}
        setStage={setStage}
        value={value}
      />
    </InputFormContainer>
  );
};

export default PlanInputForm;

const InputFormButtons: FC<
  Pick<
    PlanInputFormProps,
    "createPlan" | "isFirst" | "isLast" | "setStage" | "value"
  >
> = ({ createPlan, isFirst, isLast, setStage, value }) => {
  function onButtonClick() {
    if (isEmpty(value)) {
      alert("정보를 입력해주세요");
      return;
    }
    isLast ? createPlan() : setStage((prev) => prev + 1);
  }
  return (
    <ButtonsContainer>
      <StyledButton onClick={onButtonClick}>
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
