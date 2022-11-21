// Copyright (C) 2021 Lagood Co. All rights reserved.

import styled from "@emotion/styled";
import Link from "next/link";
import React, { FC, ReactEventHandler, ReactNode } from "react";

import Typography from "./Typography";

export type ButtonColorVariant = "PURPLE" | "PURPLE_TRANSPARENT" | "WHITE";

export interface StyledButtonContainerProps {
  color: string;
  width: number | string | (number | string)[];
}

const StyledButtonContainer = styled.button<StyledButtonContainerProps>(
  ({ color, width }) => ({
    all: "unset",
    ": disabled": {
      backgroundColor: "#D3D4D8",
      cursor: "default",
    },
    alignItems: "center",
    backgroundColor: color,
    borderRadius: 5,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    height: 65,
    justifyContent: "center",
    width,
  })
);

const StyledButton: FC<ButtonProps> = ({
  children,
  className,
  color,
  disabled,
  onClick,
  width,
}) => (
  <StyledButtonContainer
    className={className}
    color={color}
    disabled={disabled}
    onClick={onClick}
    width={width}
  >
    <Typography color={color === "black" ? "white" : "black"} size="20">
      {children}
    </Typography>
  </StyledButtonContainer>
);

export interface ButtonProps {
  children: ReactNode;
  className?: string;
  color?: string;
  disabled?: boolean;
  to?: string;
  onClick?: ReactEventHandler<HTMLButtonElement>;
  width?: number | string | (number | string)[];
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  color = "yellow",
  disabled = false,
  onClick,
  to,
  width = 250,
}) => {
  if (to) {
    return (
      <Link href={to}>
        <a href={to}>
          <StyledButton
            className={className}
            color={color}
            disabled={disabled}
            width={width}
          >
            {children}
          </StyledButton>
        </a>
      </Link>
    );
  }

  return (
    <StyledButton
      className={className}
      color={color}
      disabled={disabled}
      onClick={onClick}
      width={width}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
