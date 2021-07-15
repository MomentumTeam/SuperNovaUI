import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getMyApplies = async (rangeStart = 1, rangeEnd = 7) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/requests/getMyRequests?from=${rangeStart}&to=${rangeEnd}`
  );

  return response.data;
};

export const createRoleRequest = async (requestProperties) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/requests/createRoleRequest`,
    requestProperties
  );

  return response.data;
};
