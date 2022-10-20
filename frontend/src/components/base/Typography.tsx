// Copyright (C) 2021 Lagood Co. All rights reserved.

import styled from "@emotion/styled";

export type FontWeightVariant = "500" | "700";
export type FontSizeVariant =
  | "10"
  | "11"
  | "12"
  | "14"
  | "16"
  | "18"
  | "20"
  | "22"
  | "24"
  | "28"
  | "32"
  | "80";

const FontWeight: Record<FontWeightVariant, number> = {
  "500": 500,
  "700": 700,
};

export interface TypographyProps {
  color?: string;
  size?: FontSizeVariant;
  weight?: FontWeightVariant;
}

const FontSize: Record<FontSizeVariant, number> = {
  "10": 10,
  "11": 11,
  "12": 12,
  "14": 14,
  "16": 16,
  "18": 18,
  "20": 20,
  "22": 22,
  "24": 24,
  "28": 28,
  "32": 32,
  "80": 80,
};

const Typography = styled.p<TypographyProps>(
  ({ color = "black", size = "18", weight = "700" }) => ({
    all: "unset",
    color: color,
    fontSize: FontSize[size],
    fontWeight: FontWeight[weight],
    whiteSpace: "pre-line",
    wordBreak: "break-all",
  })
);

export default Typography;
