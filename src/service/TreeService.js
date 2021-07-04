import axios from 'axios';
import { apiBaseUrl } from '../constants/index';
import { transformNode } from '../utils/hierarchy';

export const getTree = async (rootId) => {
  const response = await axios({
    method: 'get',
    url: `${apiBaseUrl}/api/kartoffel/getOGTree/${rootId}`,
    headers: {
      'content-type': 'application/json',
    },
  });

  const ogTree = [transformNode(response.data)];
  return ogTree;
};
