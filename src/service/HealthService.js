import axiosApiInstance from '../config/axios';
import { apiBaseUrl } from '../constants';

export const isAPIAlive = async() => {
  try {
    const res = await axiosApiInstance.get(`${apiBaseUrl}/api/isAlive`);
    if (res.status === 200) return true;
  
    return false;
  } catch (err) {
    return false;
  }
}
