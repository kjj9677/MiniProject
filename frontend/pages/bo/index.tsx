import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { BASE_API_URI } from "../../const";
import Button from "../../src/components/Button";
import Typography from "../../src/components/Typography";
import { useRouter } from "next/router";

const BackOffice: FC = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scheduleTypes, setScheduleTypes] = useState<any[]>();
  const [tags, setTags] = useState<any[]>();
  const [newScheduleType, setNewScheduleType] = useState<string>();
  const [newTag, setNewTag] = useState<string>();

  function onScheduleTypeChange(e: any) {
    const { value } = e.target;
    setNewScheduleType(value);
  }

  function onTagChange(e: any) {
    const { value } = e.target;
    setNewTag(value);
  }

  async function createEnumData(newValue, endPoint) {
    if (!newValue) {
      alert("항목이 비어있습니다.");
      return;
    }
    await axios
      .post(
        `${BASE_API_URI}/${endPoint}`,
        {
          title: newScheduleType,
        },
        toAuthorizetionHeader(localStorage.getItem("accessToken"))
      )
      .then(() => router.reload());
  }

  async function deleteEnumData(id, endPoint) {
    await axios
      .delete(
        `${BASE_API_URI}/${endPoint}/${id}`,
        toAuthorizetionHeader(localStorage.getItem("accessToken"))
      )
      .then(() => router.reload());
  }

  useEffect(() => {
    async function getScheduleTypes(accessToken: string) {
      const { data } = await axios.get(
        `${BASE_API_URI}/types`,
        toAuthorizetionHeader(accessToken)
      );
      setScheduleTypes(data);
    }

    async function getTags(accessToken: string) {
      const { data } = await axios.get(
        `${BASE_API_URI}/tags`,
        toAuthorizetionHeader(accessToken)
      );
      setTags(data);
    }

    setAccessToken(localStorage.getItem("accessToken"));
    if (accessToken) {
      getScheduleTypes(accessToken);
      getTags(accessToken);
    }
    isLoading && setIsLoading(false);
  }, [accessToken, isLoading]);
  if (isLoading) {
    return <div />;
  }

  return (
    <BackOfficeContainer>
      <StyledDiv>
        <Button color="white">스케줄 종류</Button>
        {scheduleTypes &&
          scheduleTypes.map(({ id, title }) => (
            <EnumTypeInfoContainer key={id}>
              <EnumTypeInfo>
                <Typography color="white">{`${id} : ${title}`}</Typography>
              </EnumTypeInfo>
              <StyledButton
                color="white"
                onClick={() => deleteEnumData(id, "types")}
              >
                삭제
              </StyledButton>
            </EnumTypeInfoContainer>
          ))}
        <FormContainer>
          <StyledInput
            onChange={onScheduleTypeChange}
            value={newScheduleType}
          />
          <StyledButton
            color="white"
            onClick={() => createEnumData(newScheduleType, "types")}
          >
            추가
          </StyledButton>
        </FormContainer>
      </StyledDiv>
      <StyledDiv>
        <Button color="white">태그 리스트</Button>
        {tags &&
          tags.map(({ id, title }) => (
            <EnumTypeInfoContainer key={id}>
              <EnumTypeInfo>
                <Typography color="white">{`${id} : ${title}`}</Typography>
              </EnumTypeInfo>
              <StyledButton
                color="white"
                onClick={() => deleteEnumData(id, "tags")}
              >
                삭제
              </StyledButton>
            </EnumTypeInfoContainer>
          ))}
        <FormContainer>
          <StyledInput onChange={onTagChange} value={newTag} />
          <StyledButton
            color="white"
            onClick={() => createEnumData(newTag, "tags")}
          >
            추가
          </StyledButton>
        </FormContainer>
      </StyledDiv>
    </BackOfficeContainer>
  );
};

export default BackOffice;

const BackOfficeContainer = styled.div({
  alignItems: "start",
  columnGap: 60,
  display: "flex",
  flexDirection: "row",
  height: "100vh",
  justifyContent: "center",
  width: "100vw",
});

const StyledDiv = styled.div({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginTop: 100,
  rowGap: 20,
});

const EnumTypeInfo = styled.div({
  alignItems: "center",
  backgroundColor: "black",
  border: "solid 3px white",
  borderRadius: 5,
  color: "white",
  display: "flex",
  height: 45,
  justifyContent: "center",
  width: 200,
});

const EnumTypeInfoContainer = styled.div({ columnGap: 20, display: "flex" });

const StyledInput = styled.input({
  backgroundColor: "white",
  borderRadius: 5,
  fontSize: 20,
  fontFamily: "Wind",
  fontWeight: 700,
  height: 50,
  paddingLeft: 16,
  paddingRight: 16,
  width: 130,
});

const FormContainer = styled.div({
  alignSelf: "end",
  columnGap: 20,
  display: "flex",
});

const StyledButton = styled(Button)({
  height: 50,
  width: 80,
});
