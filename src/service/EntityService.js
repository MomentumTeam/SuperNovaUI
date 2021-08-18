import axiosApiInstance from "../config/axios";
import { apiBaseUrl } from "../constants/index";

export const getEntitiesUnderOG = async (ogId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getEntitiesUnderOG/:${ogId}`,
    {
      params: {
        direct: false,
      },
    }
  );

  return response.data.entities;
};

export const getRolesUnderOG = async (ogId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/GetRolesUnderOG/:${ogId}`,
    {
      params: {
        direct: false,
      },
    }
  );

  return response.data.roles;
};

export const getHierarchyUnderOG = async (ogId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/GetChildrenOfOG/:${ogId}`,
    {
      params: {
        direct: false,
      },
    }
  );

  return response.data.groups;
};