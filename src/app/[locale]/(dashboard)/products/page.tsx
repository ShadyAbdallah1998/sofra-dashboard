'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useProductsStore, useCategoriesStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import ProductForm from '@/components/products/ProductForm';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types/products.types';
import { Edit, Trash2, Plus, X, Package } from 'lucide-react';
import Image from 'next/image';

export default function ProductsPage() {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();

    const user = useAuthStore((state) => state.user);
    const products = useProductsStore((state) => state.products);
    const isLoading = useProductsStore((state) => state.isLoading);
    const pagination = useProductsStore((state) => state.pagination);
    const getProducts = useProductsStore((state) => state.getProducts);
    const createProduct = useProductsStore((state) => state.createProduct);
    const updateProduct = useProductsStore((state) => state.updateProduct);
    const deleteProduct = useProductsStore((state) => state.deleteProduct);
    const setFilters = useProductsStore((state) => state.setFilters);

    const categories = useCategoriesStore((state) => state.categories);
    const getCategories = useCategoriesStore((state) => state.getCategories);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        getProducts();
        getCategories({ limit: 100 });

        return () => {
            useProductsStore.getState().reset();
        };
    }, [user, getProducts, getCategories, router]);

    const handleCreate = () => {
        setEditingProduct(undefined);
        setShowForm(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleSubmit = async (data: CreateProductRequest | UpdateProductRequest) => {
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, data as UpdateProductRequest);
            } else {
                await createProduct(data as CreateProductRequest);
            }
            setShowForm(false);
            setEditingProduct(undefined);
        } catch (error) {
            console.error('Failed to save product:', error);
        }
    };

    const handleDelete = async (product: Product) => {
        if (confirm(`Delete "${product.name}"?`)) {
            try {
                await deleteProduct(product.id);
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
        getProducts({ page });
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
            render: (product: Product) =>
                product.image ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted shadow-sm">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                        />
                    </div>
                ) : (
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shadow-sm">
                        <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                ),
        },
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            className: 'min-w-[200px]',
            headerClassName: 'min-w-[200px]',
            render: (product: Product) => (
                <div className="space-y-1">
                    <p className="fz-14 font-semibold text-foreground">{product.name}</p>
                    {product.category && (
                        <p className="fz-12 text-muted-foreground">{product.category.name}</p>
                    )}
                </div>
            ),
        },
        {
            key: 'price',
            header: 'Price',
            sortable: true,
            className: 'w-[100px]',
            headerClassName: 'w-[100px]',
            render: (product: Product) => (
                <span className="fz-14 font-semibold text-foreground">${Number(product.price).toFixed(2)}</span>
            ),
        },
        {
            key: 'calories',
            header: 'Calories',
            sortable: true,
            className: 'w-[100px]',
            headerClassName: 'w-[100px]',
            render: (product: Product) => (
                <span className="fz-14 text-muted-foreground">{product.calories} cal</span>
            ),
        },
        {
            key: 'order',
            header: 'Order',
            sortable: true,
            className: 'w-[100px]',
            headerClassName: 'w-[100px]',
            render: (product: Product) => (
                <span className="fz-14 font-medium text-foreground">{product.order}</span>
            ),
        },
        {
            key: 'isActive',
            header: 'Status',
            className: 'w-[120px]',
            headerClassName: 'w-[120px]',
            render: (product: Product) => (
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full fz-12 font-medium shadow-sm ${product.isActive
                            ? 'bg-chart-1/10 text-chart-1 border border-chart-1/20'
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}
                >
                    {product.isActive ? 'Active' : 'Inactive'}
                </span>
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
                    <h1 className="fz-25 font-bold text-foreground">Products</h1>
                    <p className="fz-14 text-muted-foreground">
                        Manage your restaurant products
                    </p>
                </div>
                {!showForm && (
                    <Button onClick={handleCreate} className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                )}
            </div>

            {/* Form or Table */}
            {showForm ? (
                <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="fz-20 font-semibold text-foreground">
                                {editingProduct ? 'Edit Product' : 'Create New Product'}
                            </h2>
                            <p className="fz-12 text-muted-foreground">
                                {editingProduct ? 'Update product information' : 'Add a new product to your menu'}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setShowForm(false);
                                setEditingProduct(undefined);
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <ProductForm
                        product={editingProduct}
                        categories={(categories || []).map((c) => ({ id: c.id, name: c.name }))}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingProduct(undefined);
                        }}
                        isLoading={isLoading}
                        userEmail={user.email}
                    />
                </div>
            ) : (
                <>
                    <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
                        <DataTable
                            data={products || []}
                            columns={columns}
                            actions={actions}
                            isLoading={isLoading}
                            emptyMessage="No products found. Create your first product to get started."
                            keyExtractor={(product) => product.id}
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
