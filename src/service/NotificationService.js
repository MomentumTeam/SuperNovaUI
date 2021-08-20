import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const getMyNotifications = async (rangeStart = 1, rangeEnd = 7) => {
  return {notifications: [{
  "_id" : "611e4c6a9bdf7e5d2b52c54e",
  "type" : "REQUEST_SUBMITTED",
  "ownerId" : "611e3f3c265f040012aa45e8",
  "ownerType" : "SUBMITTER",
  "requestId" : "60e17ec768f33b0012cfc288",
  "message" : "Hellow",
  "reason" : "Gamba",
  "read" : false,
  "createdAt" : 1625390791614.0
}]}.notifications;
  const response = await axiosApiInstance.get(
    `${apiBaseUrl}/api/notifications/getMyNotifications?from=${rangeStart}&to=${rangeEnd}`
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