import axios from "axios";

export const getMonitoringData = (date: string) => {
    return axios.get(`${import.meta.env.VITE_BACKEND_URL}/monitoring/`,{
        params:{
            date: date
        }
    });
};