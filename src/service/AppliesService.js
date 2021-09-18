import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';


//GET

export const getRequestById = async (id) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/${id}`);

  return response.data;
};

export const getAllRequests = async (approvementStatus, from, to) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/all/${approvementStatus}`,
    {
      params: {
        from,
        to,
      }
    }
  );
  return response.data;
};

export const getRequestsByPerson = async (identifier, from, to) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/person/${identifier}`,
    {
      params: {
        from,
        to,
      }
    }
  );

  return response.data;
};

export const getRequestBySerialNumber = async (serialNumber) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/serialNumber/${serialNumber}`);

  return response.data;
};

export const searchRequestsBySubmitterDisplayName = async (displayName, from, to) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/submitterDisplayName/${displayName}`,
    {
      params: {
        from,
        to,
      }
    });

  return response.data;
};


//POST

export const createRoleRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/roleRequest`,
    applyProperties
  );

  return response.data;
};

export const assignRoleToEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/assignRoleToEntityRequest`,
    applyProperties
  );

  return response.data;
};

export const createOGRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/ogRequest`,
    applyProperties
  );

  return response.data;
};

export const createNewApproverRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/newApproverRequest`,
    applyProperties
  );

  return response.data;
};

export const createEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/entityRequest`,
    applyProperties
  );

  return response.data;
};
export const renameOGRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/renameOGRequest`,
    applyProperties
  );

  return response.data;
};

export const renameRoleRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/renameRoleRequest`,
    applyProperties
  );

  return response.data;
};

export const editEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/editEntityRequest`,
    applyProperties
  );

  return response.data;
};

export const deleteRoleRequest = async (applyProperties) => {
  const response = await axiosApiInstance.delete(
    `${apiBaseUrl}/api/requests/deleteRoleRequest`,
    applyProperties
  );

  return response.data;
};

export const deleteOGRequest = async (applyProperties) => {
  const response = await axiosApiInstance.delete(
    `${apiBaseUrl}/api/requests/deleteOGRequest`,
    applyProperties
  );

  return response.data;
};

export const disconectRoleFromEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/disconectRoleFromEntityRequest`,
    applyProperties
  );

  return response.data;
};


// PUT

export const updateApproverDecision = async (id,approverDecision,approverType) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/approverDecision/${id}`,
    {
      body:{
        approverDecision:approverDecision,
        approverType:approverType
      }
    }
  );

  return response.data;
};