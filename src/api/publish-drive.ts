import axios from "axios";

export const publishDriveCommand = async (key: string, type: string) => {
  const enable = type === "down" ? true : false;
  console.log("Publishing drive command:", { direction: key, enable });
  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/motor/drive`,
    { direction: key, enable }
  );
  return res.data;
};
