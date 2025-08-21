import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: "https://kitaba.kaaf.me/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    locale: "en",
  },
});

export const AxiosBG = axios.create({
  baseURL: "/bg",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});