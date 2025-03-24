// axiosConfig.js
import axios from 'axios';
import { toast } from 'vue-toast-notification';

// Create an Axios instance if you haven't already
const apiurl = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor: (Optional) attach the auth token if available
apiurl.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: global error handling
apiurl.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 or 403 errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      toast.error("Authorization error. Please log in again.");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default apiurl;
