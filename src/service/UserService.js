import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getUser = async () => {
  const userInfo = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/me`,
  );

  return userInfo.data;
};

export const getPictureByConnectedEntity = async () => {
  const userPic = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/me/picture`);
  return userPic.data;
};

export const getPictureByEntityIdentifier = async (identifier) => {
  const userPic = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/entities/picture/${identifier}`);
  return userPic.data;
};
