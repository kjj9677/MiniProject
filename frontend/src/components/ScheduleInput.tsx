import { FC } from "react";
import styled from "@emotion/styled";
import { HOURS, MINUTES } from "../../const";
import Typography from "../../src/components/Typography";

const SCHEDULE_TYPE = ["이동", "식사", "활동", "휴식", "기타"];

interface ScheduleInputProps {
  inputTitle: string;
  isNumber: boolean;
  isSelectType: boolean;
  isStartTime: boolean;
  name: string;
  onChange: any;
  placeholder: string;
  value: any;
}

const ScheduleInput: FC<ScheduleInputProps> = ({
  isNumber,
  isSelectType,
  isStartTime,
  name,
  onChange,
  placeholder,
  inputTitle,
  value,
}) => {
  return (
    <ScheduleInputContianer>
      <Typography>{inputTitle}</Typography>
      {isSelectType ? (
        <StyledSelect
          name={name}
          onChange={(e) => onChange(e, isNumber, isStartTime)}
          value={value}
        >
          {SCHEDULE_TYPE.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </StyledSelect>
      ) : isStartTime ? (
        <StartTimeInputContainer>
          <StyledSelect
            name="hour"
            onChange={(e) => onChange(e, isNumber, isStartTime)}
            value={value.hour}
          >
            {HOURS.map((hour) => (
              <option key={hour}>{hour}</option>
            ))}
          </StyledSelect>
          <Typography>:</Typography>
          <StyledSelect
            name="minute"
            onChange={(e) => onChange(e, isNumber, isStartTime)}
            value={value.minute}
          >
            {MINUTES.map((minutes) => (
              <option key={minutes}>{minutes}</option>
            ))}
          </StyledSelect>
        </StartTimeInputContainer>
      ) : (
        <StyledInput
          name={name}
          onChange={(e) => onChange(e, isNumber)}
          placeholder={placeholder}
          value={value}
        />
      )}
    </ScheduleInputContianer>
  );
};

export default ScheduleInput;

const ScheduleInputContianer = styled.div({
  columnGap: 12,
  display: "grid",
  gridTemplateColumns: "120px 250px",
  height: 50,
  placeItems: "center",
});

const StyledInput = styled.input({
  backgroundColor: "white",
  border: "solid 3px black",
  borderRadius: 5,
  fontSize: 16,
  fontFamily: "Wind",
  fontWeight: 700,
  height: 50,
  paddingLeft: 16,
  paddingRight: 16,
  width: 250,
});

const StyledSelect = styled.select({
  justifySelf: "start",
  backgroundColor: "white",
  border: "solid 3px black",
  borderRadius: 5,
  fontSize: 16,
  fontFamily: "Wind",
  fontWeight: 700,
  height: 50,
  paddingLeft: 8,
  paddingRight: 8,
});

const StartTimeInputContainer = styled.div({
  alignItems: "center",
  columnGap: 8,
  display: "flex",
  justifySelf: "start",
});
