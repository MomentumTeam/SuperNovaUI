import axiosApiInstance from "../config/axios";
import { apiBaseUrl } from "../constants/api";

// GROUPS
export const searchOG = async (nameAndHierarchy) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/groups/search`, {
    params: {
      nameAndHierarchy,
    },
  });

  return response.data.groups;
};

export const getOGByHierarchy = async (hierarchy) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/groups/${hierarchy}/hierarchy`);

  return response.data.groups;
};

export const getOGById = async (id) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/groups/search/${id}`);

  return response.data;
};

export const getOGChildren = async ({ id, page, pageSize }) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/groups/${id}/children`, {
    params: {
      pageSize,
      page,
    },
  });

  return response.data.groups;
};

// ROLES
export const getRoleByRoleId = async (roleId) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/roles/${roleId}`);

  return response.data;
};

export const getRolesUnderOG = async ({ id, direct, page, pageSize }) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/roles/group/${id}`, {
    params: {
      direct,
      page,
      pageSize,
    },
  });

  return response.data.roles;
};

export const getRolesByHierarchy = async ({ hierarchy, direct, page, pageSize }) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/roles/hierarchy/${hierarchy}`, {
    params: {
      direct,
      page,
      pageSize,
    },
  });

  return response.data.roles;
};

// Entities
export const getEntityByRoleId = async (roleId) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/role/${roleId}`);

  return response.data;
};

export const getEntityByMongoId = async (id) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/search/${id}`);

  return response.data;
};

export const getEntitiesByHierarchy = async (hierarchy) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/hierarchy/${hierarchy}`);

  return response.data;
};

export const getEntitiesUnderOG = async ({ id, direct, page, pageSize }) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/groups/${id}`, {
    params: {
      direct,
      pageSize,
      page,
    },
  });

  return response.data.entities;
};

export const searchEntitiesByFullName = async (fullName) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/search`, {
    params: {
      fullName,
    },
  });
  return response.data;
};

export const getEntityByIdentifier = async (identifier) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/identifier/${identifier}`);
  return response.data;
};
