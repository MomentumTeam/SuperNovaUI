import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getMyNotifications = async (rangeStart, rangeEnd) => {
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/notifications`,
    {
      params: {
        from: rangeStart,
        to: rangeEnd,
      }
    });
  return response.data;
};

export const markAsRead = async (notificationIds) => {
  const response = await axiosApiInstance.put(
    `${apiBaseUrl}/api/notifications/markAsRead`,
    { notificationIds }
  );
  return response.data;
};