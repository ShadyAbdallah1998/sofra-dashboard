'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useCategoriesStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import CategoryForm from '@/components/categories/CategoryForm';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/categories.types';
import { Edit, Trash2, Plus, X, FolderOpen } from 'lucide-react';
import Image from 'next/image';

export default function CategoriesPage() {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>();

    const user = useAuthStore((state) => state.user);
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

    const handleDelete = async (category: Category) => {
        if (confirm(`Delete "${category.name}"?`)) {
            try {
                await deleteCategory(category.id);
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
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
            render: (category: Category) => (
                <span className="fz-14 font-medium text-foreground">{category.order}</span>
            ),
        },
        {
            key: 'isActive',
            header: 'Status',
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
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
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
