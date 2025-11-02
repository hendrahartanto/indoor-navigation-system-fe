import axios from "axios";

//function untuk mengirim data koordinat target ke backend
export const setTargetPoint = (data: { x: number; y: number }) => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/rssi/target_coordinate`,
    data
  );
};
