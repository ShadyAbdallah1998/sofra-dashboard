export const CATEGORIES_ENDPOINTS = {
    GET_CATEGORIES: '/categories',
    GET_CATEGORY: (id: string) => `/categories/${id}`,
    CREATE_CATEGORY: '/categories',
    UPDATE_CATEGORY: (id: string) => `/categories/${id}`,
    DELETE_CATEGORY: (id: string) => `/categories/${id}`,
} as const;
