import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/index';

export const searchEntitiesByFullName = async (fullName) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/search`,
    {
      params: {
        fullName,
      },
    }
  );
  return response.data;
};

export const getEntityByIdentifier = async (identifier) => {
  const response = await axiosApiInstanceget(
    `${apiBaseUrl}/api/kartoffel/entities/identifier/${identifier}`
  );
  return response.data;
};

export const searchOG = async (hierarchyAndName) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/groups/search`,
    {
      params: {
        hierarchyAndName,
      },
    }
  );

  return response.data;
};
