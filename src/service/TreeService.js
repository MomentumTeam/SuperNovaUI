import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/index';
import { transformNode } from '../utils/hierarchy';

export const getTree = async (rootId) => {
  console.log(rootId)
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/${rootId}/tree`);
  console.log(response.data)
  const ogTree = [transformNode(response.data)];
  return ogTree;
};
