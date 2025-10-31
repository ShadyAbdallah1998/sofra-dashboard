import { create, StoreApi } from "zustand";
import { categoriesService } from "@/services/categoriesService";
import { reportError } from "@/lib/utils";
import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    PaginatedCategoriesResponse,
    CategoryFilters,
} from "@/types/categories.types";

type CategoriesState = {
    categories: Category[];
    currentCategory: Category | null;
    pagination: PaginatedCategoriesResponse["metadata"] | null;
    isLoading: boolean;
    error: Error | undefined;
    filters: CategoryFilters;
};

type CategoriesActions = {
    getCategories: (filters?: CategoryFilters) => Promise<void>;
    getCategory: (id: string) => Promise<void>;
    createCategory: (data: CreateCategoryRequest) => Promise<void>;
    updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    setFilters: (filters: CategoryFilters) => void;
    clearError: () => void;
    reset: () => void;
};

const initialState: CategoriesState = {
    categories: [],
    currentCategory: null,
    pagination: null,
    isLoading: false,
    error: undefined,
    filters: { page: 1, limit: 10 },
};

export const useCategoriesStore = create<CategoriesState & CategoriesActions>(
    (
        set: StoreApi<CategoriesState & CategoriesActions>["setState"],
        get: StoreApi<CategoriesState & CategoriesActions>["getState"]
    ) => ({
        ...initialState,

        getCategories: async (filters?: CategoryFilters) => {
            set({ isLoading: true, error: undefined });
            try {
                const response = await categoriesService.getCategories(
                    filters || get().filters
                );
                set({
                    categories: response.data,
                    pagination: response.metadata,
                    isLoading: false,
                });
            } catch (err) {
                const error = err as Error;
                reportError(error, { componentStack: "CategoriesStore.getCategories" });
                set({ error, isLoading: false });
                throw error;
            }
        },

        getCategory: async (id: string) => {
            set({ isLoading: true, error: undefined });
            try {
                const category = await categoriesService.getCategory(id);
                set({ currentCategory: category, isLoading: false });
            } catch (err) {
                const error = err as Error;
                reportError(error, { componentStack: "CategoriesStore.getCategory" });
                set({ error, isLoading: false });
                throw error;
            }
        },

        createCategory: async (data: CreateCategoryRequest) => {
            console.log("🚀 Creating category with data:", data);
            set({ isLoading: true, error: undefined });
            try {
                console.log("📡 Calling API...");
                await categoriesService.createCategory(data);

                // Refresh categories list
                await get().getCategories();
                set({ isLoading: false });
            } catch (err) {
                const error = err as Error;
                console.error("❌ Error creating category:", error);
                reportError(error, {
                    componentStack: "CategoriesStore.createCategory",
                });
                set({ error, isLoading: false });
                throw error;
            }
        },

        updateCategory: async (id: string, data: UpdateCategoryRequest) => {
            set({ isLoading: true, error: undefined });
            try {
                await categoriesService.updateCategory(id, data);
                // Update current category if it's the same
                if (get().currentCategory?.id === id) {
                    await get().getCategory(id);
                }
                // Refresh categories list
                await get().getCategories();
                set({ isLoading: false });
            } catch (err) {
                const error = err as Error;
                reportError(error, {
                    componentStack: "CategoriesStore.updateCategory",
                });
                set({ error, isLoading: false });
                throw error;
            }
        },

        deleteCategory: async (id: string) => {
            set({ isLoading: true, error: undefined });
            try {
                await categoriesService.deleteCategory(id);
                // Clear current category if it's the deleted one
                if (get().currentCategory?.id === id) {
                    set({ currentCategory: null });
                }
                // Refresh categories list
                await get().getCategories();
                set({ isLoading: false });
            } catch (err) {
                const error = err as Error;
                reportError(error, {
                    componentStack: "CategoriesStore.deleteCategory",
                });
                set({ error, isLoading: false });
                throw error;
            }
        },

        setFilters: (filters: CategoryFilters) => {
            set({ filters: { ...get().filters, ...filters } });
        },

        clearError: () => set({ error: undefined }),

        reset: () => set(initialState),
    })
);
