import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';

export const sendHierarchyDataMail = async (data) => {
  await axiosApiInstance.post(`${apiBaseUrl}/api/mail/export/roles`, data);
};
