import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/index';

export const searchEntitiesByFullName = async (fullName) => {
  const response = await axiosApiInstance({
    method: 'get',
    url: `${apiBaseUrl}/api/kartoffel/entities/search?fullName=${fullName}`,
    headers: {
      'content-type': 'application/json',
    },
  });
  return response.data;
};

export const getEntityByIdentifier = async (identifier) => {
  const response = await axiosApiInstance({
    method: 'get',
    url: `${apiBaseUrl}/api/kartoffel/entities/${identifier}`,
    headers: {
      'content-type': 'application/json',
    },
  });
  return response.data;
};

export const searchOG = async (nameAndHierarchy) => {
  const response = await axiosApiInstance({
    method: 'get',
    url: `${apiBaseUrl}/api/kartoffel/groups/search?nameAndHierarchy=${nameAndHierarchy}`,
    headers: {
      'content-type': 'application/json',
    },
  });
  return response.data;
};
