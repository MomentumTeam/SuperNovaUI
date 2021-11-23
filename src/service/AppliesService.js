import axiosApiInstance from "../config/axios";
import { apiBaseUrl } from "../constants/api";
import { organizeRows } from "../utils/applies";
import { TYPES, STATUSES, AUTOCOMPLETE_STATUSES } from "../constants";
import dateFormat from "dateformat";
import "../assets/css/local/components/status.css";

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

const formatMyRequest = (r) => {
  const statusClasses = {
    SUBMITTED: "neutral",
    APPROVED_BY_COMMANDER: "neutral",
    APPROVED_BY_SECURITY: "neutral",
    IN_PROGRESS: "neutral",
    DECLINED: "bad",
    DONE: "good",
    FAILED: "bad",
  };
  return {
    ...r,
    formattedType: TYPES[r.type],
    date: dateFormat(Date(r.createdAt), "dddd, mmmm dS, yyyy, HH:MM:ss"),
    reason: r.comments,
    handler: r.commanders.map((c) => c.displayName).join(", "),
    search: "",
    PrettyStatus: (
      <button
        className={"btn-status " + statusClasses[r.status]}
        type="button"
        title={r.status}
      >
        {STATUSES[r.status]}
      </button>
    ),
  };
};

export const getFormattedMyRequests = async (from, to) => {
  const response = await getMyRequests(from, to);
  const requests = response?.requests;
  if (Array.isArray(requests)) {
    return requests.map(formatMyRequest);
  }
  return [];
};

export const getRequestById = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/${id}`
  );

  return response.data;
};

export const getMyRequestsBySerialNumber = async (from, to, serialNumber) => {
  try {
    return [formatMyRequest(await getRequestBySerialNumber(serialNumber))];
  } catch (error) {
    return [];
  }
};

export const getMyRequestsByType = async (from, to, type) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/my`, {
    params: {
      from,
      to,
      type,
    },
  });
  if (Array.isArray(response.data.requests)) {
    return response.data.requests.map(formatMyRequest);
  }
  return [];
};

export const getMyRequestsBySearch = async (from, to, value) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/my`, {
    params: {
      searchQuery: value,
    },
  });
  if (Array.isArray(response.data.requests)) {
    return response.data.requests.map(formatMyRequest);
  }
  return [];
};

export const getMyRequestsByStatus = async (from, to, status) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/my`, {
    params: {
      from,
      to,
      status,
    },
  });
  if (Array.isArray(response.data.requests)) {
    return response.data.requests.map(formatMyRequest);
  }
  return [];
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
  try{
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
  approversType,
  comment,
}) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/approver/transfer/${reqId}`,
    {
      approvers,
      type: approversType,
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
