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

export const getPictureByEntityId = async (id) => {
  const userPic = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/picture/${id}`,
  );
  return userPic.data;
};
