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
export type FontColorVariant =
  | "GRAY"
  | "GRAY_DARK"
  | "MAIN_TEXT"
  | "PURPLE"
  | "PURPLE_DARK"
  | "PURPLE_TRANSPARENT"
  | "SECONDARY_TEXT"
  | "WHITE";

const FontWeight: Record<FontWeightVariant, number> = {
  "500": 500,
  "700": 700,
};

export interface TypographyProps {
  color?: FontColorVariant;
  size?: FontSizeVariant | FontSizeVariant[];
  weight?: FontWeightVariant | FontWeightVariant[];
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
  ({ color = "MAIN_TEXT", size = "24", weight = "700" }) => ({
    all: "unset",
    color: color,
    fontSize: size,
    fontWeight: weight,
    whiteSpace: "pre-line",
    wordBreak: "break-all",
  })
);

export default Typography;
