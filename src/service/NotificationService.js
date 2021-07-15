import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getMyNotifications = async (rangeStart = 1, rangeEnd = 7) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/notifications/getMyNotifications?from=${rangeStart}&to=${rangeEnd}`
  );
  console.log(response.data);
  return response.data;
};

export const markAsRead = async (notificationIds) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/notifications/markAsRead`,
    { notificationIds: notificationIds }
  );
  console.log(response.data);
  return response.data;
};
