import { getApiCore } from './index';
import { PRODUCTS_ENDPOINTS } from '@/constants/products';
import type {
    Product,
    CreateProductRequest,
    UpdateProductRequest,
    PaginatedProductsResponse,
    ProductFilters,
} from '@/types/products.types';

export const productsService = {
    async getProducts(filters?: ProductFilters): Promise<PaginatedProductsResponse> {
        const api = getApiCore();
        const params = new URLSearchParams();

        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const queryString = params.toString();
        const url = queryString ? `${PRODUCTS_ENDPOINTS.GET_PRODUCTS}?${queryString}` : PRODUCTS_ENDPOINTS.GET_PRODUCTS;

        const response = await api.get<PaginatedProductsResponse>(url);
        return response.data;
    },

    async getProduct(id: string): Promise<Product> {
        const api = getApiCore();
        const response = await api.get<Product>(PRODUCTS_ENDPOINTS.GET_PRODUCT(id));
        return response.data;
    },

    async createProduct(data: CreateProductRequest): Promise<void> {
        const api = getApiCore();
        await api.post(PRODUCTS_ENDPOINTS.CREATE_PRODUCT, data);
    },

    async updateProduct(id: string, data: UpdateProductRequest): Promise<void> {
        const api = getApiCore();
        await api.patch(PRODUCTS_ENDPOINTS.UPDATE_PRODUCT(id), data);
    },

    async deleteProduct(id: string): Promise<void> {
        const api = getApiCore();
        await api.delete(PRODUCTS_ENDPOINTS.DELETE_PRODUCT(id));
    },
};
