import axios from "axios";

//function untuk mendapatkan data monitoring (rssi, variance, mean, median) dari backend
export const getMonitoringData = (date: string) => {
  return axios.get(`${import.meta.env.VITE_BACKEND_URL}/monitoring/`, {
    params: {
      date: date
    }
  });
};
