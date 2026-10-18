import axios from "axios";
import { router } from "../AppRouter/AppRouter";

export const axiosInterceptors = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInterceptors.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user_tkn");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInterceptors.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user_tkn");
      router.navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInterceptors;