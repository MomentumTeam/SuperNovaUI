import axios from 'axios';
import { apiBaseUrl } from '../constants/index';
import { transformNode } from '../utils/hierarchy';

export const searchEntitiesByFullName = async (fullName) => {
  const response = await axios({
    method: 'get',
    url: `${apiBaseUrl}/api/kartoffel/searchEntitiesByFullName?fullName=${fullName}`,
    headers: {
      'content-type': 'application/json',
    },
  });
  return response.data;
};

export const getEntityByIdNumber = async (idNumber) => {
  const response = await axios({
    method: 'get',
    url: `${apiBaseUrl}/api/kartoffel/getEntityByIdNumber/${idNumber}`,
    headers: {
      'content-type': 'application/json',
    },
  });
  return response.data;
};

export const searchOG = async (hierarchyAndName) => {
  const response = await axios({
    method: 'get',
    url: `${apiBaseUrl}/api/kartoffel/searchOG?hierarchyAndName=${hierarchyAndName}`,
    headers: {
      'content-type': 'application/json',
    },
  });
  return response.data;
};
