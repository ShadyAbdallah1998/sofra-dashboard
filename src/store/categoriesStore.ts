import { create, StoreApi } from "zustand";
import { categoriesService } from "@/services/categoriesService";
import { handleError, handleSuccess } from "@/lib/utils";
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
    error: string | null;
    filters: CategoryFilters;
};

type CategoriesActions = {
    getCategories: (filters?: CategoryFilters) => Promise<{ success: boolean; error?: string }>;
    getCategory: (id: string) => Promise<{ success: boolean; error?: string }>;
    createCategory: (data: CreateCategoryRequest) => Promise<{ success: boolean; error?: string }>;
    updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<{ success: boolean; error?: string }>;
    deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;
    setFilters: (filters: CategoryFilters) => void;
    clearError: () => void;
    reset: () => void;
};

const initialState: CategoriesState = {
    categories: [],
    currentCategory: null,
    pagination: null,
    isLoading: false,
    error: null,
    filters: { page: 1, limit: 10 },
};

export const useCategoriesStore = create<CategoriesState & CategoriesActions>(
    (
        set: StoreApi<CategoriesState & CategoriesActions>["setState"],
        get: StoreApi<CategoriesState & CategoriesActions>["getState"]
    ) => ({
        ...initialState,

        getCategories: async (filters?: CategoryFilters) => {
            set({ isLoading: true, error: null });
            try {
                const response = await categoriesService.getCategories(
                    filters || get().filters
                );
                set({
                    categories: response.data,
                    pagination: response.metadata,
                    isLoading: false,
                });
                return { success: true };
            } catch (error) {
                const errorMessage = handleError(error, {
                    showToast: false,
                    returnError: true
                });
                set({ error: errorMessage, isLoading: false });
                return { success: false, error: errorMessage };
            }
        },

        getCategory: async (id: string) => {
            set({ isLoading: true, error: null });
            try {
                const category = await categoriesService.getCategory(id);
                set({ currentCategory: category, isLoading: false });
                return { success: true };
            } catch (error) {
                const errorMessage = handleError(error, {
                    showToast: false,
                    returnError: true
                });
                set({ error: errorMessage, isLoading: false });
                return { success: false, error: errorMessage };
            }
        },

        createCategory: async (data: CreateCategoryRequest) => {
            console.log("🚀 Creating category with data:", data);
            set({ isLoading: true, error: null });
            try {
                console.log("📡 Calling API...");
                await categoriesService.createCategory(data);

                // Refresh categories list
                await get().getCategories();
                set({ isLoading: false });

                // Show success toast only
                handleSuccess('Category created successfully!');
                return { success: true };
            } catch (error) {
                console.error("❌ Error creating category:", error);

                // Get error message and set it in store
                const errorMessage = handleError(error, {
                    showToast: false,  // Don't show toast
                    returnError: true  // Return error for component
                });

                set({ error: errorMessage, isLoading: false });
                return { success: false, error: errorMessage };
            }
        },

        updateCategory: async (id: string, data: UpdateCategoryRequest) => {
            set({ isLoading: true, error: null });
            try {
                await categoriesService.updateCategory(id, data);

                // Update current category if it's the same
                if (get().currentCategory?.id === id) {
                    await get().getCategory(id);
                }

                // Refresh categories list
                await get().getCategories();
                set({ isLoading: false });

                // Show success toast only
                handleSuccess('Category updated successfully!');
                return { success: true };
            } catch (error) {
                // Get error message and set it in store
                const errorMessage = handleError(error, {
                    showToast: false,  // Don't show toast
                    returnError: true  // Return error for component
                });

                set({ error: errorMessage, isLoading: false });
                return { success: false, error: errorMessage };
            }
        },

        deleteCategory: async (id: string) => {
            set({ isLoading: true, error: null });
            try {
                await categoriesService.deleteCategory(id);

                // Clear current category if it's the deleted one
                if (get().currentCategory?.id === id) {
                    set({ currentCategory: null });
                }

                // Refresh categories list
                await get().getCategories();
                set({ isLoading: false });

                // Show success toast only
                handleSuccess('Category deleted successfully!');
                return { success: true };
            } catch (error) {
                // Get error message and set it in store
                const errorMessage = handleError(error, {
                    showToast: false,  // Don't show toast
                    returnError: true  // Return error for component
                });

                set({ error: errorMessage, isLoading: false });
                return { success: false, error: errorMessage };
            }
        },

        setFilters: (filters: CategoryFilters) => {
            set({ filters: { ...get().filters, ...filters } });
        },

        clearError: () => set({ error: null }),

        reset: () => set(initialState),
    })
);
