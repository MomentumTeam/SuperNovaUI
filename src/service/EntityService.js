import axiosApiInstance from "../config/axios";
import { apiBaseUrl } from "../constants/index";

export const getEntitiesUnderOG = async (ogId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/groups/${ogId}`,
    {
      params: {
        direct: true,  //if secuirty : false
      },
    }
  );

  return response.data.entities;
};

export const getRolesUnderOG = async (ogId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/roles/group/${ogId}`,
    {
      params: {
        direct: false,
      },
    }
  );

  return response.data.roles;
};

export const getChildrenOfOG = async (ogId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/${ogId}/children`,
    {
      params: {
        direct: false,
      },
    }
  );

  return response.data.groups;
};