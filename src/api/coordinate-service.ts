import axios from "axios";

export const setTargetPoint = (data: { x: number; y: number }) => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/rssi/target_coordinate`,
    data
  );
};
