export function toAuthorizetionHeader(accessToken: string) {
  return { headers: { Authorization: `Bearer ${accessToken}` } };
}
