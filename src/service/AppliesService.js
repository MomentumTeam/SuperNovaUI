
import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getUserApplies = async (userId, rangeStart = 1, rangeEnd = 2) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/getRequestsSubmittedBy/${userId}?from=${rangeStart}&to=${rangeEnd}`);
  
  return response.data;
}