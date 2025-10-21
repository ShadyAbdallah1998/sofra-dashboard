import Axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';


type TInitProps = {
    xContent: 'mobile' | 'desktop';
    enableFingerprint?: true;
    apiLocale: string;
    extraHeaders?: Record<string, string>;
};

interface ApiErrorResponse {
    message?: string;
    error?: string;
    statusCode?: number;
}

export const commonHeaders = {
    'Cache-Control': 'no-cache, max-age=0, must-revalidate, no-store',
    'content-type': 'application/json',
    'x-platform': 'web',
    'x-cms': 'v2',
};

let api: AxiosInstance = Axios.create({
    baseURL: 'uninitialized!',
});

export const initializeAxios = ({
    xContent,
    apiLocale,
    extraHeaders,
}: TInitProps): void => {

    api = Axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/',
        timeout: 10000,
        withCredentials: true,
        headers: {
            ...commonHeaders,
            'x-content': xContent,
            'x-locale': apiLocale,
            ...extraHeaders,
        },
    });

    api.interceptors.request.use(
        async (requestConfig) => {
          // 🔑 always make sure locale is present
          if (apiLocale) {
            requestConfig.headers['x-locale'] = apiLocale;
          }

          // you can also attach fingerprint if needed
          return requestConfig as InternalAxiosRequestConfig;
        },
        (error) => Promise.reject(error)
      );


    api.interceptors.response.use(
        async (responseConfig) => {
            return responseConfig;
        },
        (error: AxiosError<ApiErrorResponse>) => {
            // Handle API errors with your format: { message, error, statusCode }
            if (error.response?.data) {
                const { message, error: errorType, statusCode } = error.response.data;

                // If error data is a string (non-API error)
                if (typeof error.response.data === 'string') {
                    return Promise.reject({
                        message: 'Something went wrong.',
                        info: error.response.data,
                        status: error.response.status,
                    });
                }

                // Extract user-friendly message
                let userMessage = message || errorType;

                // Fallback to status code defaults
                if (!userMessage) {
                    const status = error.response.status;
                    if (status === 401) userMessage = 'Unauthorized access';
                    else if (status === 403) userMessage = 'Forbidden';
                    else if (status === 404) userMessage = 'Resource not found';
                    else if (status === 500) userMessage = 'Internal server error';
                    else userMessage = 'Server error occurred';
                }

                return Promise.reject({
                    message: userMessage,
                    statusCode: statusCode || error.response.status,
                    originalError: error.response.data,
                });
            }

            // Handle network errors
            if (error.message === 'Network Error') {
                return Promise.reject({
                    message: "Looks like you're offline. Make sure you're connected to the internet and try again",
                    status: 0,
                });
            }

            // Generic error fallback
            return Promise.reject({
                message: error.message || 'An unexpected error occurred',
                status: 418,
            });
        },
    );
};
// export const getApiCore = () => api;

// Function to get the current api instance
export const getApiCore = (): AxiosInstance => api;

// Legacy export for backward compatibility
export const apiCore = api;
