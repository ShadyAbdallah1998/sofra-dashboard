import type { Category } from './categories.types';

export interface Product {
    id: string;
    name: string;
    order: number;
    isActive: boolean;
    price: number;
    category?: Category;
    categoryId: string;
    calories: number;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface CreateProductRequest {
    name: string;
    order?: number;
    isActive: boolean;
    price: number;
    categoryId: string;
    calories: number;
    description?: string;
    image?: string;
    createdBy: string;
}

export interface UpdateProductRequest {
    name: string;
    order?: number;
    isActive: boolean;
    description?: string;
    image?: string;
    calories: number;
    updatedBy: string;
}

export interface PaginatedProductsResponse {
    metadata: {
        page: number;
        perPage: number;
        total: number;
        lastPage: number;
    };
    data: Product[];
}

export interface ProductFilters {
    page?: number;
    limit?: number;
}
