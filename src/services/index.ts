import Axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';


type TInitProps = {
    xContent: 'mobile' | 'desktop';
    enableFingerprint?: true;
    apiLocale: string;
    extraHeaders?: Record<string, string>;
};

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
        // Requests are sent using a reverse proxy, check next.config.js rewrites
        baseURL: '/',
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
        (error) => {
            if (error.response && error.response.data) {
                /**
                 * If the error is NOT initiated from the API (ie: for express/cloudflare errors)
                 * then use generic error message for snackBar message and pass error info to sentry
                 */
                if (typeof error.response.data === 'string') {
                    const newData = {
                        error: 'Something went wrong.',
                        info: error.response.data,
                        status: error.response.status,
                    };

                    return Promise.reject(newData);
                }

                return Promise.reject({
                    ...error.response.data,
                    status: error.response.status,
                });
            }

            if (error.message === 'Network Error') {
                error.message = 'Looks like you’re offline. Make sure you’re connected to the internet and try again';
            }

            return Promise.reject({ error: error.message, status: 418 });
        },
    );
};
// export const getApiCore = () => api;

// Function to get the current api instance
export const getApiCore = (): AxiosInstance => api;

// Legacy export for backward compatibility
export const apiCore = api;


