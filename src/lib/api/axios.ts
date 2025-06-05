import axios from 'axios';
import { supabase } from '@/context/supabaseClient';
import { toast } from '@/components/ui/use-toast';
export const BASE_URL = `${import.meta.env.VITE_API_URL}`;

// Create a function to get the access token
const getAccessToken = () => {
  const session = localStorage.getItem('sb-auth-token');
  if (session) {
    try {
      const { access_token } = JSON.parse(session);
      return access_token;
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  }
  return null;
};

// Create a base configuration for axios
const baseConfig = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const axiosInstance = axios.create({
  ...baseConfig,
  withCredentials: false,
});

// Add request interceptor for axiosInstance to log requests
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making public request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Public request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for axiosInstance to log responses
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Public response:', response);
    return response;
  },
  (error) => {
    console.error('Public response error:', {
      status: error?.response?.status,
      data: error?.response?.data,
      headers: error?.response?.headers,
      message: error?.message,
      code: error?.code,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        headers: error?.config?.headers,
        baseURL: error?.config?.baseURL,
        fullURL: `${error?.config?.baseURL}${error?.config?.url}`,
      },
    });
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios.create({
  ...baseConfig,
  withCredentials: true,
});

// Add request interceptor to add the token to requests
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    console.log('Token for request:', token);
    if (token) {
      // Ensure the headers object exists
      config.headers = config.headers || {};
      // Set the Authorization header with the Bearer token
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request headers:', config.headers);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Create a custom error class for permission errors
export class PermissionError extends Error {
  response?: any;

  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

    // Log the full error response for debugging
    console.log('Error response:', {
      status: error?.response?.status,
      data: error?.response?.data,
      headers: error?.response?.headers,
    });

    // Handle 403 Forbidden errors
    if (error?.response?.status === 403) {
      // Log the specific error data we're trying to extract
      console.log('403 Error data:', {
        message: error?.response?.data?.message,
        error: error?.response?.data?.error,
        fullData: error?.response?.data,
      });

      // Get the error message from the response
      let errorMessage = 'No tiene permisos para realizar esta acción';

      // Check if there's a specific error message in the response
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      console.log('Final error message:', errorMessage);

      // Show toast notification with the actual error message
      toast({
        variant: 'destructive',
        title: 'Error de permisos',
        description: errorMessage,
      });

      // Create a custom error that can be caught and handled by the component
      const permissionError = new PermissionError(errorMessage);
      permissionError.response = error.response;

      // Reject with the custom error
      return Promise.reject(permissionError);
    }

    // Handle other errors
    let errorMessage = 'Algo salió mal, vuelve a intentarlo';

    // Check for specific error messages
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    console.log('Other error message:', errorMessage);

    toast({
      variant: 'destructive',
      title: 'Error',
      description: errorMessage,
    });

    if (error?.response?.status === 401 && !prevRequest?.sent) {
      if (isRefreshing) {
        // If another request is already refreshing, add this request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosPrivate(prevRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;
      prevRequest.sent = true;

      try {
        // Get the refresh token from localStorage
        const session = localStorage.getItem('sb-auth-token');
        if (!session) {
          throw new Error('No refresh token available');
        }

        // Use Supabase's refresh token functionality
        const {
          data: { session: newSession },
          error: refreshError,
        } = await supabase.auth.refreshSession();

        if (refreshError) throw refreshError;

        // Save the new session
        if (newSession) {
          localStorage.setItem(
            'sb-auth-token',
            JSON.stringify({
              access_token: newSession.access_token,
              refresh_token: newSession.refresh_token,
            })
          );

          // Update the Authorization header for the failed request
          prevRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
        }

        processQueue();
        return axiosPrivate(prevRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Clear the tokens if refresh fails
        localStorage.removeItem('sb-auth-token');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
