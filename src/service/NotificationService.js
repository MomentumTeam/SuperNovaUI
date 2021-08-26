import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getMyNotifications = async (rangeStart = 1, rangeEnd = 7) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/notifications/getMyNotifications?from=${rangeStart}&to=${rangeEnd}&startTime=0`
  );
  return response.data;
};

export const markAsRead = async (notificationIds) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/notifications/markAsRead`,
    { notificationIds: notificationIds }
  );
  return response.data;
};