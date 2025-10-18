import axios from "axios";

// function ini dipakai untuk memulai navigation ke device ESP32
export const startNavigation = async () => {
    console.log("Start Navigation:");
    const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/rssi/start`,
    );
    return res.data;
};
