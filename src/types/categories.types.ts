export interface Category {
    id: string;
    name: string;
    order: number;
    isActive: boolean;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface CreateCategoryRequest {
    name: string;
    order?: number;
    isActive: boolean;
    description?: string;
    image?: string;
    createdBy: string;
}

export interface UpdateCategoryRequest {
    name: string;
    order?: number;
    isActive: boolean;
    description?: string;
    image?: string;
    updatedBy: string;
}

export interface PaginationMetadata {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
}

export interface PaginatedCategoriesResponse {
    metadata: PaginationMetadata;
    data: Category[];
}

export interface CategoryFilters {
    page?: number;
    limit?: number;
}
