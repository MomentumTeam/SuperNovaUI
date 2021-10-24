import axiosApiInstance from "../config/axios";
import { apiBaseUrl } from "../constants/api";

export const searchUnits = async (nameAndHierarchy) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/tea/units/search`, {
    params: {
      nameAndHierarchy,
    },
  });

  return response.data;
};
