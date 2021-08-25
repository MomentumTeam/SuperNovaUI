
import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getUser = async (userID) => {
  const userInfo = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getMyUser`
  );
  return userInfo.data;
};

export const getUserType = async (userID) => {
  const userInfo = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/getUserType/${userID}`
  );
  return userInfo.data;
};

export const getUsers = async () => {
  const users = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/searchOG/`);
  return users;
};

export const getPictureByEntityId = async () => {
  const userPic = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/getPictureByEntityId`
  );
  return userPic.data;
};
