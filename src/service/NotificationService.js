import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getMyNotifications = async (rangeStart, rangeEnd) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/notifications`,
    {
      params: {
        rangeStart,
        rangeEnd,
      }
    });
  return response.data;
};

export const markAsRead = async (notificationIds) => {
  const response = await axiosApiInstance.post(
    `${apiBaseUrl}/api/notifications/markAsRead`,
    { notificationIds: notificationIds }
  );
  return response.data;
};