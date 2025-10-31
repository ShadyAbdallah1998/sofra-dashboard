'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useCategoriesStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import CategoriesList from '@/components/categories/CategoriesList';
import CategoryForm from '@/components/categories/CategoryForm';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/categories.types';

export default function CategoriesPage() {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>();

    // Auth store
    const user = useAuthStore((state) => state.user);

    // Categories store
    const categories = useCategoriesStore((state) => state.categories);
    const isLoading = useCategoriesStore((state) => state.isLoading);
    const pagination = useCategoriesStore((state) => state.pagination);
    const getCategories = useCategoriesStore((state) => state.getCategories);
    const createCategory = useCategoriesStore((state) => state.createCategory);
    const updateCategory = useCategoriesStore((state) => state.updateCategory);
    const deleteCategory = useCategoriesStore((state) => state.deleteCategory);
    const setFilters = useCategoriesStore((state) => state.setFilters);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        getCategories();

        return () => {
            useCategoriesStore.getState().reset();
        };
    }, [user, getCategories, router]);

    const handleCreate = () => {
        setEditingCategory(undefined);
        setShowForm(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, data as UpdateCategoryRequest);
            } else {
                await createCategory(data as CreateCategoryRequest);
            }
            setShowForm(false);
            setEditingCategory(undefined);
        } catch (error) {
            console.error('Failed to save category:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id);
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
        getCategories({ page });
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="fz-25 font-bold text-foreground">Categories</h1>
                        <p className="fz-14 text-muted-foreground mt-1">
                            Manage your product categories
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => router.push('/dashboard')}>
                            Back to Dashboard
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/products')}>
                            Manage Products
                        </Button>
                        {!showForm && (
                            <Button onClick={handleCreate}>
                                Add Category
                            </Button>
                        )}
                    </div>
                </div>

                {/* Form or List */}
                {showForm ? (
                    <div className="bg-card rounded-lg shadow-md p-8">
                        <h2 className="fz-20 font-semibold text-foreground mb-6">
                            {editingCategory ? 'Edit Category' : 'Create New Category'}
                        </h2>
                        <CategoryForm
                            category={editingCategory}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingCategory(undefined);
                            }}
                            isLoading={isLoading}
                            userEmail={user.email}
                        />
                    </div>
                ) : (
                    <>
                        <div className="bg-card rounded-lg shadow-md p-6">
                            <CategoriesList
                                categories={categories}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.lastPage > 1 && (
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-4 fz-14 text-muted-foreground">
                                    Page {pagination.page} of {pagination.lastPage}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.lastPage}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
