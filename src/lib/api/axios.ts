import axios from 'axios';
const secure = import.meta.env.PROD ? 'https://' : 'http://';
const BASE_URL = `${secure}${import.meta.env.VITE_API_URL}`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (
      error?.response?.status === 401 ||
      (error?.response?.status === 403 && !prevRequest?.sent)
    ) {
      // Handle 401 and specific 403 cases here
      prevRequest.sent = true;
      await refresh();
      return axiosPrivate(prevRequest);
    }
    // If not handled, throw the error for catch block
    throw error;
  }
);

const refresh = async () => {
  return await axiosPrivate.get('/api/auth/refresh', {
    withCredentials: true,
  });
};
