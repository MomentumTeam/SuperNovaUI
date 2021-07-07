
import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getUser = async (userID) => {
    const userInfo = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/getEntityByMongoId/${userID}`);
    return userInfo.data;
};

export const getUsers = async () => {
  const users = await axiosApiInstance.get(`${apiBaseUrl}/api/kartoffel/searchOG/`);
  return users;
};