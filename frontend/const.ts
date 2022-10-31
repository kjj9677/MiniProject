export const BASE_API_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3031"
    : "http://211.197.23.229:3031";

export const BASE_FRONTEND_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3030"
    : "http://211.197.23.229:3030";

export const REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3030/login/kakao"
    : "http://211.197.23.229:3030/login/kakao";
