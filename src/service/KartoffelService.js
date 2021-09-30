import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const searchOG = async (hierarchyAndName) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/search`,
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
    `${apiBaseUrl}/api/kartoffel/entities/search`,
    {
      params: {
        fullName,
      },
    }
  );

  return response.data;
};

export const getEntityByIdentifier = async (identifier) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/identifier/${identifier}`
  );

  return response.data;
};

export const getRoleByRoleId = async (roleId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/roles/${roleId}`
  );

  return response.data;
};

export const getRolesUnderOG = async (roleId, direct) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/roles/group/${roleId}`,
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
    `${apiBaseUrl}/api/kartoffel/entities/role/${roleId}`
  );

  return response.data;
};

export const getEntityByMongoId = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/search/${id}`
  );

  return response.data;
};

export const getOGChildren = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/${id}/children`
  );

  return response.data;
};

export const getEntitiesUnderOG = async (id, direct) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/groups/${id}`,
    {
      params: {
        direct,
      },
    }
  );

  return response.data.entities;
};
