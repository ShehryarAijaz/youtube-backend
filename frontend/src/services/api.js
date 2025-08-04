import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
    withCredentials: true,
})

api.interceptors.response.use(
    (res) => {
      // If backend wraps all responses in { statusCode, success, message, data }
      const { statusCode, message, success, data } = res.data;
  
      return {
        status: statusCode,
        data,
        success,
        message,
      };
    },
    (error) => {
      // Return the error response data which should contain the message
      return Promise.reject(error.response?.data || error);
    }
  );
  
export default api;