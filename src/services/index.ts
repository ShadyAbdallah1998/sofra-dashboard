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

interface CustomError extends Error {
    statusCode?: number;
    status?: number;
    info?: string;
    originalError?: ApiErrorResponse;
}

export const commonHeaders = {
    'Cache-Control': 'no-cache, max-age=0, must-revalidate, no-store',
    'content-type': 'application/json',
    'x-platform': 'web',
    'x-cms': 'v2',
};

let api: AxiosInstance = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/',
    timeout: 10000,
    withCredentials: true,
    headers: commonHeaders,
});

let isInitialized = false;

export const initializeAxios = ({
    xContent,
    apiLocale,
    extraHeaders,
}: TInitProps): void => {
    if (isInitialized) return;

    api = Axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/',
        timeout: 10000,
        withCredentials: false,
        headers: {
            ...commonHeaders,
            'x-content': xContent,
            'x-locale': apiLocale,
            ...extraHeaders,
        },
    });

    api.interceptors.request.use(
        async (requestConfig) => {
          if (apiLocale) {
            requestConfig.headers['x-locale'] = apiLocale;
          }

          return requestConfig as InternalAxiosRequestConfig;
        },
        (error) => Promise.reject(error)
      );


    api.interceptors.response.use(
        async (responseConfig) => {
            return responseConfig;
        },
        (error: AxiosError<ApiErrorResponse>) => {
            if (error.response?.data) {
                const { message, error: errorType, statusCode } = error.response.data;

                // If error data is a string (non-API error)
                if (typeof error.response.data === 'string') {
                    const customError = new Error('Something went wrong.') as CustomError;
                    customError.status = error.response.status;
                    customError.info = error.response.data;
                    return Promise.reject(customError);
                }

                // Extract user-friendly message and create proper error
                const userMessage = message || errorType || 'An error occurred';
                const customError = new Error(userMessage) as CustomError;
                customError.statusCode = statusCode || error.response.status;
                customError.originalError = error.response.data;
                return Promise.reject(customError);
            }

            // Handle network errors
            if (error.message === 'Network Error') {
                const networkError = new Error("Looks like you're offline. Make sure you're connected to the internet and try again") as CustomError;
                networkError.status = 0;
                return Promise.reject(networkError);
            }

            return Promise.reject(error);
        },
    );

    isInitialized = true;
};
// export const getApiCore = () => api;

// Function to get the current api instance
export const getApiCore = (): AxiosInstance => api;

// Legacy export for backward compatibility
export const apiCore = api;
