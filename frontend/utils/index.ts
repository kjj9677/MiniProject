export function toAuthorizetionHeader(accessToken: string) {
  return { headers: { Authorization: `Bearer ${accessToken}` } };
}

export function getPeriodText(period: number): string {
  if (period === 1) {
    return "당일치기";
  }

  return `${period - 1}박${period}일`;
}
