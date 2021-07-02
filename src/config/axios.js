import axios from 'axios';
const axiosApiInstance = axios.create();

// Add a request interceptor
axiosApiInstance.interceptors.request.use(function (config) {
    console.log(localStorage.getItem('token'))
    
    // Do something before request is sent
    return {
        ...config,
        headers: {
            'authorization': localStorage.getItem('token')
        },
    };
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axiosApiInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    const originalRequest = error.config;

    if (error?.response?.status === 403 && !originalRequest.retry) {
        originalRequest.retry = true;
        window.location.href = "http://localhost:2000/api/auth/login";
        return axiosApiInstance(originalRequest);
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default axiosApiInstance;