import { create, StoreApi } from 'zustand';
import { productsService } from '@/services/productsService';
import type {
    Product,
    CreateProductRequest,
    UpdateProductRequest,
    PaginatedProductsResponse,
    ProductFilters,
} from '@/types/products.types';

type ProductsState = {
    products: Product[];
    currentProduct: Product | null;
    pagination: PaginatedProductsResponse['metadata'] | null;
    isLoading: boolean;
    error: Error | undefined;
    filters: ProductFilters;
};

type ProductsActions = {
    getProducts: (filters?: ProductFilters) => Promise<void>;
    getProduct: (id: string) => Promise<void>;
    createProduct: (data: CreateProductRequest) => Promise<void>;
    updateProduct: (id: string, data: UpdateProductRequest) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    setFilters: (filters: ProductFilters) => void;
    clearError: () => void;
    reset: () => void;
};

const initialState: ProductsState = {
    products: [],
    currentProduct: null,
    pagination: null,
    isLoading: false,
    error: undefined,
    filters: { page: 1, limit: 10 },
};

export const useProductsStore = create<ProductsState & ProductsActions>(
    (
        set: StoreApi<ProductsState & ProductsActions>['setState'],
        get: StoreApi<ProductsState & ProductsActions>['getState']
    ) => ({
        ...initialState,

        getProducts: async (filters?: ProductFilters) => {
            set({ isLoading: true, error: undefined });
            try {
                const response = await productsService.getProducts(filters || get().filters);
                set({
                    products: response.data,
                    pagination: response.metadata,
                    isLoading: false,
                });
            } catch (err) {
                const error = err as Error;
                console.error('Error getting products:', error);
                set({ error, isLoading: false });
                throw error;
            }
        },

        getProduct: async (id: string) => {
            set({ isLoading: true, error: undefined });
            try {
                const product = await productsService.getProduct(id);
                set({ currentProduct: product, isLoading: false });
            } catch (err) {
                const error = err as Error;
                console.error('Error getting product:', error);
                set({ error, isLoading: false });
                throw error;
            }
        },

        createProduct: async (data: CreateProductRequest) => {
            set({ isLoading: true, error: undefined });
            try {
                await productsService.createProduct(data);
                // Refresh products list
                await get().getProducts();
                set({ isLoading: false });
            } catch (err) {
                const error = err as Error;
                console.error('Error creating product:', error);
                set({ error, isLoading: false });
                throw error;
            }
        },

        updateProduct: async (id: string, data: UpdateProductRequest) => {
            set({ isLoading: true, error: undefined });
            try {
                await productsService.updateProduct(id, data);
                // Update current product if it's the same
                if (get().currentProduct?.id === id) {
                    await get().getProduct(id);
                }
                // Refresh products list
                await get().getProducts();
                set({ isLoading: false });
            } catch (err) {
                const error = err as Error;
                console.error('Error updating product:', error);
                set({ error, isLoading: false });
                throw error;
            }
        },

        deleteProduct: async (id: string) => {
            set({ isLoading: true, error: undefined });
            try {
                await productsService.deleteProduct(id);
                // Clear current product if it's the deleted one
                if (get().currentProduct?.id === id) {
                    set({ currentProduct: null });
                }
                // Refresh products list
                await get().getProducts();
                set({ isLoading: false });
            } catch (err) {
                const error = err as Error;
                console.error('Error deleting product:', error);
                set({ error, isLoading: false });
                throw error;
            }
        },

        setFilters: (filters: ProductFilters) => {
            set({ filters: { ...get().filters, ...filters } });
        },

        clearError: () => set({ error: undefined }),

        reset: () => set(initialState),
    })
);
