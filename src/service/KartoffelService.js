import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const searchOG = async (hierarchyAndName) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/searchOG`,
    {
      params: {
        hierarchyAndName,
      },
    }
  );

  return response.data;
};

export const searchEntitiesByFullName = async (fullName) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/searchEntitiesByFullName`,
    {
      params: {
        fullName,
      },
    }
  );

  return response.data;
};

export const getEntityByIdNumber = async (idNumber) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getEntityByIdNumber/:${idNumber}`
  );

  return response.data;
};

export const getRoleByRoleId = async (roleId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getRoleByRoleId/:${roleId}`
  );

  return response.data;
};

export const getRolesUnderOG = async (id, direct) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getRolesUnderOG/:${id}`,
    {
      params: {
        direct,
      },
    }
  );

  return response.data;
};

export const getEntityByRoleId = async (roleId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getEntityByRoleId/:${roleId}`
  );

  return response.data;
};

export const getEntityByMongoId = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getEntityByMongoId/:${id}`
  );

  return response.data;
};

export const getChildrenOfOG = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getChildrenOfOG/:${id}`
  );

  return response.data;
};

export const getEntitiesUnderOG = async (id, direct) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getEntitiesUnderOG/:${id}`,
    {
      params: {
        direct,
      },
    }
  );

  return response.data;
};
