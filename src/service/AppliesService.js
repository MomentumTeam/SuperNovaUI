import axiosApiInstance from "../config/axios";
import { apiBaseUrl } from "../constants/api";
import { organizeRows } from "../utils/applies";
import "../assets/css/local/components/status.css";

//GET

export const getMyRequests = async (from, to) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/my`, {
    params: {
      from,
      to,
      sortField: "UPDATED_AT",
    },
  });

  return response.data;
};

export const getMyRequestsWithParams = async (params) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/my`, {
    params: { ...params, sortField: "UPDATED_AT" },
  });

  if (Array.isArray(response.data.requests)) {
    return response.data.requests;
  }
  return [];
};

export const getMyRequestsBySerialNumber = async (serialNumber) => {
  try {
    return [await getRequestBySerialNumber(serialNumber)];
  } catch (error) {
    return [];
  }
};

export const getMyRequestsByType = async (from, to, type) => {
  return getMyRequestsWithParams({ from, to, type });
};

export const getMyRequestsBySearch = async (from, to, value) => {
  return getMyRequestsWithParams({ from, to, searchQuery: value });
};

export const getMyRequestsByStatus = async (from, to, status) => {
  return getMyRequestsWithParams({ from, to, status });
};

export const getRequestById = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/${id}`
  );

  return response.data;
};

export const getMyApproveRequests = async ({
  from,
  to,
  searchQuery = null,
  status = null,
  type = null,
  sortField = null,
  sortOrder = null,
}) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/approve/my`,
    {
      params: {
        from,
        to,
        searchQuery,
        status,
        type,
        sortField,
        sortOrder,
      },
    }
  );

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
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/approve/all`,
    {
      params: {
        from,
        to,
        searchQuery,
        status,
        type,
        sortField,
        sortOrder,
      },
    }
  );

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

  response.data.rows = organizeRows(response.data.rows);

  return response.data;
};

export const getBulkChangeRoleHierarchyData = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/bulk/request/changeRoleHierarchy/${id}`
  );

  response.data.rows = organizeRows(response.data.rows);

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

export const uploadBulkFile = async (file, type) => {
  try {
    const response = await axiosApiInstance.post(
      `${apiBaseUrl}/api/bulk/upload?type=${type}`,
      file,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 500) {
      return false;
    }
  }
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

export const transferApproverRequest = async ({
  reqId,
  approvers,
  type,
  comment,
}) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/approver/transfer/${reqId}`,
    {
      approvers,
      type,
      commentForApprovers: comment,
    }
  );

  return response.data;
};

export const updateApproversCommentsRequest = async ({
  requestId,
  approversType,
  comment,
}) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/approver/comments/${requestId}`,
    {
      type: approversType,
      commentForApprovers: comment,
    }
  );

  return response.data;
};
