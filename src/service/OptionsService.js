import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants/api';
import '../assets/css/local/components/status.css';

// GET

export const getUserOptions = async () => {
  const response = await axiosApiInstance.get(`${apiBaseUrl}/api/options`);
  return response.data;
};


//PATCH

export const updateUserOptions = async (optionToUpdate, optionState) => {
  const body = { [optionToUpdate]: optionState };
  const response = await axiosApiInstance.patch(`${apiBaseUrl}/api/options/update`, 
    body
  );
  return response.data;
};
