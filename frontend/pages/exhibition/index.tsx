import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { toAuthorizetionHeader } from "../../utils";
import { BASE_API_URI } from "../../const";
import Button from "../../src/components/Button";
import PlanInfo from "../../src/components/PlanInfo";
import Typography from "../../src/components/Typography";

const Exhibition: FC = () => {
  const [accessToken, setAccessToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [planList, setPlanList] = useState<any[]>();

  useEffect(() => {
    async function getPublicPlanList(accessToken: string) {
      const { data } = await axios.get(
        `${BASE_API_URI}/plans?isPublic=true`,
        toAuthorizetionHeader(accessToken)
      );
      setPlanList(data);
    }

    setAccessToken(localStorage.getItem("accessToken"));
    if (accessToken) {
      getPublicPlanList(accessToken);
    }
    isLoading && setIsLoading(false);
  }, [accessToken, isLoading]);
  if (isLoading) {
    return <div />;
  }

  console.log(planList);
  return (
    <ExhibitionContainer>
      <Button color="white">여행 계획표 목록</Button>
      {planList &&
        planList.map(({ id, destination, period, title, tagMappings }) => (
          <div key={id}>
            <PlanInfo
              id={id}
              destination={destination}
              period={period}
              title={title}
            />
            <div style={{ columnGap: 15, display: "flex" }}>
              {tagMappings.map(({ id, tag: { title } }) => (
                <Typography color="white" key={id} size="20">
                  {title}
                </Typography>
              ))}
            </div>
          </div>
        ))}
    </ExhibitionContainer>
  );
};

export default Exhibition;

const ExhibitionContainer = styled.div({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  justifyContent: "center",
  rowGap: 30,
  width: "100vw",
});
