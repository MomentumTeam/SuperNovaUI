
import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getUserApplies = async (userId = '41224d776a326fb40f000002', rangeStart = 1, rangeEnd = 2) => {
  const userApplies = await axiosApiInstance.get(`${apiBaseUrl}/api/requests/getRequestsSubmittedBy/${userId}?from=${rangeStart}&to=${rangeEnd}`);
  return userApplies;
}