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

export const HOURS = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
];

export const MINUTES = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];
