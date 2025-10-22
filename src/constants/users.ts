export const USERS_ENDPOINTS = {
  GET_USER: (id: string) => `/users/${id}`,
  UPDATE_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `/users/${id}`,
} as const;
