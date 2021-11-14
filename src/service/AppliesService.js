import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

//GET

export const getMyRequests = async (from, to) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/my`, {
    params: {
      from,
      to,
    },
  });

  return response.data;
};

export const getRequestById = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/${id}`
  );

  return response.data;
};


export const getMyApproveRequests = async ({from, to, searchQuery = null, status = null, type = null, sortField = null, sortOrder = null}) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/approve/my`, {
    params: {
      from,
      to,
      searchQuery,
      status,
      type,
      sortField,
      sortOrder
    },
  });

  return response.data;
};

export const getAllApproveRequests = async ({
  from,
  to,
  searchQuery = null,
  status = null,
  type = null,
  sortField = null,
  sortOrder = null,
}) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/approve/all`, {
    params: {
      from,
      to,
      searchQuery,
      status,
      type,
      sortField,
      sortOrder,
    },
  });

  return response.data;
};

export const getRequestsByPerson = async (
  id,
  personType,
  personInfoType,
  from,
  to
) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/person/${id}`,
    {
      params: {
        personType,
        personInfoType,
        from,
        to,
      },
    }
  );

  return response.data;
};

export const getRequestBySerialNumber = async (serialNumber) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/serialNumber/${serialNumber}`
  );

  return response.data;
};

export const searchRequestsBySubmitterDisplayName = async (
  id,
  displayName,
  from,
  to
) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/person/${id}`,
    {
      params: {
        displayName,
        from,
        to,
      },
    }
  );

  return response.data;
};

export const getCreateBulkRoleData = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/bulk/request/createRole/${id}`
  );

  return response.data;
};

export const getBulkChangeRoleHierarchyData = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/bulk/request/changeRoleHierarchy/${id}`
  );

  return response.data;
};

//POST

export const createRoleRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/request/role`,
    applyProperties
  );

  return response.data;
};

export const createOGRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/request/og`,
    applyProperties
  );

  return response.data;
};

export const createNewApproverRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/request/approver`,
    applyProperties
  );

  return response.data;
};

export const createEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/request/entity`,
    applyProperties
  );

  return response.data;
};

export const deleteRoleRequest = async (applyProperties) => {
  const response = await axiosApiInstance.delete(
    `${apiBaseUrl}/api/requests/request/role`,
    applyProperties
  );

  return response.data;
};

export const deleteOGRequest = async (applyProperties) => {
  const response = await axiosApiInstance.delete(
    `${apiBaseUrl}/api/requests/request/og`,
    applyProperties
  );

  return response.data;
};

export const disconectRoleFromEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.delete(
    `${apiBaseUrl}/api/requests/request/entity/role`,
    applyProperties
  );

  return response.data;
};

export const uploadBulkFile = async (file) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/bulk/upload`,
    file,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data;
};

export const createRoleBulkRequest = async (data) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/bulk/request/role`,
    data
  );

  return response.data;
};

// PUT

export const renameOGRequest = async (applyProperties) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/request/og/rename`,
    applyProperties
  );

  return response.data;
};

export const renameRoleRequest = async (applyProperties) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/request/role/rename`,
    applyProperties
  );

  return response.data;
};

export const editEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/request/entity`,
    applyProperties
  );

  return response.data;
};

export const assignRoleToEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/request/entity/role`,
    applyProperties
  );

  return response.data;
};


export const changeRoleHierarchyRequest = async (data) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/request/role/og`,
    data
  );

  return response.data;
};

export const changeRoleHierarchyBulkRequest = async (data) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/bulk/request/role/hierarchy`,
    data
  );

  return response.data;
};


export const transferApproverRequest = async ({reqId, approvers, approversType, comment}) => {  
  const response = await axiosApiInstance.put(`${apiBaseUrl}/api/requests/approver/transfer/${reqId}`, {
      approvers,
      type: approversType,
      commentForApprovers: comment,
  });

  return response.data;
};
