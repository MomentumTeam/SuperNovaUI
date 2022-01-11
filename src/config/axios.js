import axios from 'axios';
import cookies from 'js-cookie';
import { apiBaseUrl } from '../constants/api';
import configStore from '../store/Config';

console.log('apiBaseUrl', apiBaseUrl);

const axiosApiInstance = axios.create();

// Add a request interceptor
axiosApiInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${cookies.get(configStore.TOKEN_NAME)}`,
      },
    };
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosApiInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (error?.response?.status === 403 && !originalRequest.retry) {
      originalRequest.retry = true;
      window.location.href = `${apiBaseUrl}/api/auth/login`;
      return axiosApiInstance(originalRequest);
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
