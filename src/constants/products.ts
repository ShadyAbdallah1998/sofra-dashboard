export const PRODUCTS_ENDPOINTS = {
    GET_PRODUCTS: '/products',
    GET_PRODUCT: (id: string) => `/products/${id}`,
    CREATE_PRODUCT: '/products',
    UPDATE_PRODUCT: (id: string) => `/products/${id}`,
    DELETE_PRODUCT: (id: string) => `/products/${id}`,
} as const;
