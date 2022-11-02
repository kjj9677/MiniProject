export function toAuthorizetionHeader(accessToken: string) {
  return { headers: { Authorization: `Bearer ${accessToken}` } };
}

export function getPeriodText(period: number): string {
  if (period === 1) {
    return "당일치기";
  }

  return `${period - 1}박${period}일`;
}

export function getScheduleTypeIdByString(value: string) {
  if (value === "이동") {
    return 1;
  }

  if (value === "식사") {
    return 2;
  }

  if (value === "활동") {
    return 3;
  }

  if (value === "휴식") {
    return 4;
  }
  return 5;
}
