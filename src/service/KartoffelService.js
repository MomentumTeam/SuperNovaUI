import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

// GROUPS
export const searchOG = async (nameAndHierarchy, withRoles = false, underGroupId = null) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/groups/search`, {
    params: {
      nameAndHierarchy,
      withRoles,
      ...underGroupId && {underGroupId}
    },
  });

  return response.data.groups;
};

export const getOGByHierarchy = async (hierarchy, withRoles = false) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/groups/hierarchy`, {
    params: { hierarchy, withRoles },
  });

  return response.data;
};

export const getOGById = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/search/${id}`
  );

  return response.data;
};

export const getOGChildren = async ({
  id,
  page,
  pageSize,
  direct = false,
  withRoles = false,
  withParent=false,
}) => {
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
        withRoles,
        withParent,
      },
    }
  );

  return response.data.groups;
};

// ROLES
export const getRoleByRoleId = async (roleId) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/roles/${roleId}`);

  return response.data;
};

export const getRoleByDI = async (uniqueId) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/roles/di/${uniqueId}`);

  return response.data;
};

export const searchRolesByRoleId = async (roleId) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/roles/search/${roleId.toLowerCase()}`);

  return response.data.roles;
};

export const getRolesUnderOG = async ({ id, direct = false, page, pageSize }) => {
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
    `${apiBaseUrl}/api/kartoffel/roles/hierarchy/${encodeURIComponent(hierarchy)}`,
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

  return response.data;
};

// Entities
export const getEntityByRoleId = async (roleId) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/role/${roleId}`
  );

  return response.data;
};

export const getEntityByDI = async (uniqueId) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/di/${uniqueId}`);

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
    `${apiBaseUrl}/api/kartoffel/entities/hierarchy/${encodeURIComponent(hierarchy)}`
  );

  return response.data;
};

export const getEntitiesUnderOG = async ({ id, direct = false, page, pageSize }) => {
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
  // TODO: add underGroupId
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/search`, {
    params: {
      fullName,
    },
  });
  return response.data;
};

export const getEntityByIdentifier = async (identifier) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/identifier/${identifier}`
  );
  return response.data;
};

// DI
export const searchDIByUniqueId = async (uniqueId) => {
   const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/di/search/${uniqueId}`);
   return response.data.digitalIdentities;
}

export const getDIByUniqueId = async (uniqueId) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/di/${uniqueId}`);
  return response.data;
};
