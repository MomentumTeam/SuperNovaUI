import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getMyApplies = async (from , to ) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/myRequests`,
    {
      params: {
        from,
        to,
      }
    }
  );

  return response.data;
};

//for commander

export const getRequestsAsCommander = async (from, to) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/requestsByCommander`,
    {
      params: {
        from,
        to,
      }
    }
  );

  return response.data;
};


//for security

export const getAllRequests = async (from, to) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/`,
    {
      params: {
        from,
        to,
      }
    }
  );

  return response.data;
};

export const getRequestsSubmittedBy = async (id, from, to) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/submittedBy/${id}`,
    {
      params: {
        from,
        to,
      }
    }
  );

  return response.data;
};

//create applies

export const createRoleRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/roleRequest`,
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

export const createEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/entityRequest`,
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

export const editEntityRequest = async (applyProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/editEntityRequest`,
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

//update applies

export const renameOGRequest = async (applyProperties) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/renameOGRequest`,
    applyProperties
  );

  return response.data;
};

export const renameRoleRequest = async (applyProperties) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/renameRoleRequest`,
    applyProperties
  );

  return response.data;
};

//delete applies

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
