/** @format */

import axios from 'axios';
import { apiBaseUrl } from '../constants/index';

const transformNode = (node) => {
  return {
    label: node.name,
    children: !node.children
      ? []
      : node.children.map((child) => transformNode(child)),
    expanded: false,
  };
};

export const getTree = async (rootId) => {
  console.log(`${apiBaseUrl}/api/kartoffel/getOGTree/${rootId}`);
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
