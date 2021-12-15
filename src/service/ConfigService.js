import axiosApiInstance from "../config/axios";
import { apiBaseUrl } from "../constants/api";

export const getSupportGroupLink = async () => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/support`
  );
  return response.data.supportGroupLink;
};
