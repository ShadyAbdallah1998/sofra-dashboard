'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useCategoriesStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import CategoryForm from '@/components/categories/CategoryForm';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/categories.types';
import { Edit, Trash2, Plus, X, FolderOpen, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function CategoriesPage() {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>();

    const user = useAuthStore((state) => state.user);
    const categories = useCategoriesStore((state) => state.categories);
    const isLoading = useCategoriesStore((state) => state.isLoading);
    const error = useCategoriesStore((state) => state.error);
    const pagination = useCategoriesStore((state) => state.pagination);
    const getCategories = useCategoriesStore((state) => state.getCategories);
    const createCategory = useCategoriesStore((state) => state.createCategory);
    const updateCategory = useCategoriesStore((state) => state.updateCategory);
    const deleteCategory = useCategoriesStore((state) => state.deleteCategory);
    const setFilters = useCategoriesStore((state) => state.setFilters);
    const clearError = useCategoriesStore((state) => state.clearError);

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
        clearError();
        setShowForm(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        clearError();
        setShowForm(true);
    };

    const handleSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
        clearError();

        const result = editingCategory
            ? await updateCategory(editingCategory.id, data as UpdateCategoryRequest)
            : await createCategory(data as CreateCategoryRequest);

        if (result.success) {
            setShowForm(false);
            setEditingCategory(undefined);
        }
        // Error is automatically set in store
    };

    const handleDelete = async (category: Category) => {
        if (confirm(`Delete "${category.name}"?`)) {
            clearError();
            await deleteCategory(category.id);
            // Error is automatically set in store if deletion fails
        }
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
        getCategories({ page });
    };

    if (!user) {
        return null;
    }

    const columns = [
        {
            key: 'image',
            header: 'Image',
            className: 'w-[80px]',
            headerClassName: 'w-[80px]',
            render: (category: Category) =>
                category.image ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted shadow-sm">
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                        />
                    </div>
                ) : (
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shadow-sm">
                        <FolderOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                ),
        },
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            className: 'min-w-[200px]',
            headerClassName: 'min-w-[200px]',
            render: (category: Category) => (
                <div className="space-y-1">
                    <p className="fz-14 font-semibold text-foreground">{category.name}</p>
                    {category.description && (
                        <p className="fz-12 text-muted-foreground line-clamp-1">
                            {category.description}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'order',
            header: 'Order',
            sortable: true,
            className: 'w-[100px]',
            headerClassName: 'w-[100px]',
            render: (category: Category) => (
                <span className="fz-14 font-medium text-foreground">{category.order}</span>
            ),
        },
        {
            key: 'isActive',
            header: 'Status',
            className: 'w-[120px]',
            headerClassName: 'w-[120px]',
            render: (category: Category) => (
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full fz-12 font-medium shadow-sm ${category.isActive
                            ? 'bg-chart-1/10 text-chart-1 border border-chart-1/20'
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}
                >
                    {category.isActive ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            key: 'createdBy',
            header: 'Created By',
            className: 'min-w-[200px]',
            headerClassName: 'min-w-[200px]',
            render: (category: Category) => (
                <span className="fz-12 text-muted-foreground">{category.createdBy}</span>
            ),
        },
    ];

    const actions = [
        {
            label: 'Edit',
            onClick: handleEdit,
            variant: 'outline' as const,
            icon: <Edit className="h-3 w-3" />,
        },
        {
            label: 'Delete',
            onClick: handleDelete,
            variant: 'destructive' as const,
            icon: <Trash2 className="h-3 w-3" />,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="fz-25 font-bold text-foreground">Categories</h1>
                    <p className="fz-14 text-muted-foreground">
                        Manage your product categories
                    </p>
                </div>
                {!showForm && (
                    <Button onClick={handleCreate} className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                )}
            </div>

            {/* Error Alert - Shows for both form and delete errors */}
            {!showForm && error && (
                <div className="bg-destructive/10 border border-destructive rounded-xl p-4 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="fz-14 font-semibold text-destructive mb-1">
                            Error
                        </h3>
                        <p className="fz-13 text-destructive/90">{error}</p>
                    </div>
                    <button
                        onClick={clearError}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Form or Table */}
            {showForm ? (
                <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="fz-20 font-semibold text-foreground">
                                {editingCategory ? 'Edit Category' : 'Create New Category'}
                            </h2>
                            <p className="fz-12 text-muted-foreground">
                                {editingCategory ? 'Update category information' : 'Add a new category to your menu'}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setShowForm(false);
                                setEditingCategory(undefined);
                                clearError();
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Form Error Alert */}
                    {error && (
                        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="fz-14 font-semibold text-destructive mb-1">
                                    Validation Error
                                </h3>
                                <p className="fz-13 text-destructive/90">{error}</p>
                            </div>
                            <button
                                onClick={clearError}
                                className="text-destructive hover:text-destructive/80 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <CategoryForm
                        category={editingCategory}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingCategory(undefined);
                            clearError();
                        }}
                        isLoading={isLoading}
                        userEmail={user.email}
                    />
                </div>
            ) : (
                <>
                    <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
                        <DataTable
                            data={categories || []}
                            columns={columns}
                            actions={actions}
                            isLoading={isLoading}
                            emptyMessage="No categories found. Create your first category to get started."
                            keyExtractor={(category) => category.id}
                        />
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.lastPage > 1 && (
                        <div className="flex items-center justify-between bg-card text-card-foreground rounded-xl shadow-sm border border-border p-4">
                            <p className="fz-14 text-muted-foreground">
                                Showing page {pagination.page} of {pagination.lastPage} ({pagination.total} total)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="shadow-sm"
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.lastPage}
                                    className="shadow-sm"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
