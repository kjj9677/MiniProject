import { FC } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { getPeriodText } from "../../utils";
import Typography from "./Typography";

interface PlanInfoProps {
  destination: string;
  id: number;
  period: number;
  title: string;
}

const PlanInfo: FC<PlanInfoProps> = ({ destination, id, period, title }) => {
  return (
    <Link href={`/plans/${id}`}>
      <a href={`/plans/${id}`}>
        <PlanInfoContainer>
          <Typography color="white" size="24">
            {title}
          </Typography>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "absolute",
              right: 10,
              rowGap: 10,
              top: 10,
            }}
          >
            <DetailContainer>
              <Typography>{destination}</Typography>
            </DetailContainer>
            <DetailContainer>
              <Typography>{getPeriodText(period)}</Typography>
            </DetailContainer>
          </div>
        </PlanInfoContainer>
      </a>
    </Link>
  );
};

const PlanInfoContainer = styled.div({
  alignItems: "center",
  backgroundColor: "black",
  border: "solid 3px white",
  borderRadius: 5,
  cursor: "pointer",
  display: "flex",
  height: 150,
  justifyContent: "center",
  position: "relative",
  width: 450,
});

const DetailContainer = styled.div({
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 5,
  color: "white",
  display: "flex",
  justifyContent: "center",
  height: 50,
  width: 100,
});

export default PlanInfo;
