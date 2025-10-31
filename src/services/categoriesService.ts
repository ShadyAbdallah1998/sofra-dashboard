import { getApiCore } from './index';
import { CATEGORIES_ENDPOINTS } from '@/constants/categories';
import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    PaginatedCategoriesResponse,
    CategoryFilters,
} from '@/types/categories.types';

export const categoriesService = {
    async getCategories(filters?: CategoryFilters): Promise<PaginatedCategoriesResponse> {
        const api = getApiCore();
        const params = new URLSearchParams();

        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const queryString = params.toString();
        const url = queryString ? `${CATEGORIES_ENDPOINTS.GET_CATEGORIES}?${queryString}` : CATEGORIES_ENDPOINTS.GET_CATEGORIES;

        const response = await api.get<PaginatedCategoriesResponse>(url);
        return response.data;
    },

    async getCategory(id: string): Promise<Category> {
        const api = getApiCore();
        const response = await api.get<Category>(CATEGORIES_ENDPOINTS.GET_CATEGORY(id));
        return response.data;
    },

    async createCategory(data: CreateCategoryRequest): Promise<void> {
        const api = getApiCore();
        await api.post(CATEGORIES_ENDPOINTS.CREATE_CATEGORY, data);
    },

    async updateCategory(id: string, data: UpdateCategoryRequest): Promise<void> {
        const api = getApiCore();
        await api.patch(CATEGORIES_ENDPOINTS.UPDATE_CATEGORY(id), data);
    },

    async deleteCategory(id: string): Promise<void> {
        const api = getApiCore();
        await api.delete(CATEGORIES_ENDPOINTS.DELETE_CATEGORY(id));
    },
};
