import axiosApiInstance from "../config/axios";
import { apiBaseUrl } from "../constants/index";
import { transformNode } from "../utils/hierarchy";

export const getEntitiesUnderOG = async (ogId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getEntitiesUnderOG/:${ogId}`,
    {
      params: {
        direct: false,
      },
    }
  );

  return response.data;
};
