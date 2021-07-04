import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/index';
import { transformNode } from '../utils/hierarchy';

export const getTree = async (rootId) => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/getOGTree/${rootId}`);
  
  const ogTree = [transformNode(response.data)];
  return ogTree;
};
