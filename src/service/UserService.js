import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getUser = async () => {
  const userInfo = await axiosApiInstance.get(
    `${apiBaseUrl}/api/kartoffel/entities/me`,
  );

  return userInfo.data;
};

export const getUserType = async (userID) => {
  const userInfo = await axiosApiInstance.get(
    `${apiBaseUrl}/api/approver/userType/${userID}`,
  );
  return userInfo.data;
};

// export const getUsers = async () => {
//   const users = await axiosApiInstance.get(
//     `${apiBaseUrl}/api/kartoffel/searchOG/`);
//   return users;
// };

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
