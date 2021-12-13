import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

// GROUPS
export const searchOG = async (nameAndHierarchy) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/search`,
    {
      params: {
        nameAndHierarchy,
      },
    }
  );

  return response.data.groups;
};

export const getOGByHierarchy = async (hierarchy) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/hierarchy`,
    {
      params: { hierarchy },
    }
  );

  return response.data;
};

export const getOGById = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/search/${id}`
  );

  return response.data;
};

export const getOGChildren = async ({ id, page, pageSize, direct = false }) => {
  // If id not specified, using the Aman group children
  const response = await axiosApiInstance.get(
    id
      ? `${apiBaseUrl}/api/kartoffel/groups/${id}/children`
      : `${apiBaseUrl}/api/kartoffel/groups/children`,
    {
      params: {
        direct,
        pageSize,
        page,
      },
    }
  );

  return response.data.groups;
};

// ROLES
export const getRoleByRoleId = async (roleId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/roles/${roleId}`
  );

  return response.data;
};

export const getRolesUnderOG = async ({ id, direct, page, pageSize }) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/roles/group/${id}`,
    {
      params: {
        direct,
        page,
        pageSize,
      },
    }
  );

  return response.data.roles;
};

export const getRolesByHierarchy = async ({
  hierarchy,
  direct,
  page,
  pageSize,
}) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/roles/hierarchy/${hierarchy}`,
    {
      params: {
        direct,
        page,
        pageSize,
      },
    }
  );

  return response.data.roles;
};

export const getIsJobTitleAlreadyTaken = async (jobTitle, directGroup) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/roles/job/taken`,
    {
      params: {
        jobTitle,
        directGroup,
      },
    }
  );
  return response.data;
};

export const isJobTitleAlreadyTakenRequest = async (jobTitle, directGroup) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/roles/job/taken?jobTitle=${jobTitle}&directGroup=${directGroup}`
  );

  return response.data;
};

export const isHierarchyAlreadyTakenRequest = async (name, parent) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/name/taken?name=${name}&parent=${parent}`
  );

  return response;
};

// Entities
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

export const getEntitiesByHierarchy = async (hierarchy) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/hierarchy/${hierarchy}`
  );

  return response.data;
};

export const getEntitiesUnderOG = async ({ id, direct, page, pageSize }) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/groups/${id}`,
    {
      params: {
        direct,
        pageSize,
        page,
      },
    }
  );

  return response.data.entities;
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
