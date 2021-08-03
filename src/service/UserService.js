import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getUser = async (userID) => {
  const userInfo = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getMyUser`
  );
  return userInfo.data;
};

export const getPictureByEntityId = async () => {
  const userPic = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getPictureByEntityId`
  );
  return userPic.data;
};
