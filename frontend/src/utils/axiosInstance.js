/* eslint-env browser */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout.Plese try again');
    }
  }
);

export default axiosInstance;
