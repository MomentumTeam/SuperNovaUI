import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getMyApplies = async (from = 1, to = 7) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/getMyRequests`,
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
    `${apiBaseUrl}/api/requests/getRequestsAsCommander`,
    {
      params: {
        from,
        to,
      }
    }
  );

  return response.data;
};

export const getRequestsByCommander = async (id, from, to) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/renameRoleRequest/:${id}`,
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
    `${apiBaseUrl}/api/requests/getAllRequests`,
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
    `${apiBaseUrl}/api/requests/getRequestsSubmittedBy/:${id}`,
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

export const createRoleRequest = async (requestProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/createRoleRequest`,
    requestProperties
  );

  return response.data;
};

export const createOGRequest = async (requestProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/createOGRequest`,
    requestProperties
  );

  return response.data;
};

export const createEntityRequest = async (requestProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/createEntityRequest`,
    requestProperties
  );

  return response.data;
};

export const assignRoleToEntityRequest = async (requestProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/assignRoleToEntityRequest`,
    requestProperties
  );

  return response.data;
};

export const editEntityRequest = async (requestProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/editEntityRequest`,
    requestProperties
  );

  return response.data;
};

export const disconectRoleFromEntityRequest = async (requestProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/disconectRoleFromEntityRequest`,
    requestProperties
  );

  return response.data;
};

//update applies

export const renameOGRequest = async (requestProperties) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/renameOGRequest`,
    requestProperties
  );

  return response.data;
};

export const renameRoleRequest = async (requestProperties) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/requests/renameRoleRequest`,
    requestProperties
  );

  return response.data;
};

//delete applies

export const deleteRoleRequest = async (requestProperties) => {
  const response = await axiosApiInstance.delete(
    `${apiBaseUrl}/api/requests/deleteRoleRequest`,
    requestProperties
  );

  return response.data;
};

export const deleteOGRequest = async (requestProperties) => {
  const response = await axiosApiInstance.delete(
    `${apiBaseUrl}/api/requests/deleteOGRequest`,
    requestProperties
  );

  return response.data;
};
