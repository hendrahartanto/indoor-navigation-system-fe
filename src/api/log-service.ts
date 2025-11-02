import axios from "axios";

//function untuk mendapatkan data log dari backend
export const getLogData = (day: string, page: number) => {
  return axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/logs/`, {
    params: {
      day: day,
      page: page
    }
  });
};
