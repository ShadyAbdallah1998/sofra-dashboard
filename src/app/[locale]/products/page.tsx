'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useProductsStore, useCategoriesStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import ProductsList from '@/components/products/ProductsList';
import ProductForm from '@/components/products/ProductForm';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types/products.types';

export default function ProductsPage() {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();

    // Auth store
    const user = useAuthStore((state) => state.user);

    // Products store
    const products = useProductsStore((state) => state.products);
    const isLoading = useProductsStore((state) => state.isLoading);
    const pagination = useProductsStore((state) => state.pagination);
    const getProducts = useProductsStore((state) => state.getProducts);
    const createProduct = useProductsStore((state) => state.createProduct);
    const updateProduct = useProductsStore((state) => state.updateProduct);
    const deleteProduct = useProductsStore((state) => state.deleteProduct);
    const setFilters = useProductsStore((state) => state.setFilters);

    // Categories store
    const categories = useCategoriesStore((state) => state.categories);
    const getCategories = useCategoriesStore((state) => state.getCategories);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        getProducts();
        getCategories({ limit: 100 }); // Get all categories for dropdown

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

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id);
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const handlePageChange = (page: number) => {
        setFilters({ page });
        getProducts({ page });
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
                        <h1 className="fz-25 font-bold text-foreground">Products</h1>
                        <p className="fz-14 text-muted-foreground mt-1">
                            Manage your restaurant products
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => router.push('/dashboard')}>
                            Back to Dashboard
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/categories')}>
                            Manage Categories
                        </Button>
                        {!showForm && (
                            <Button onClick={handleCreate}>
                                Add Product
                            </Button>
                        )}
                    </div>
                </div>

                {/* Form or List */}
                {showForm ? (
                    <div className="bg-card rounded-lg shadow-md p-8">
                        <h2 className="fz-20 font-semibold text-foreground mb-6">
                            {editingProduct ? 'Edit Product' : 'Create New Product'}
                        </h2>
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
                        <div className="bg-card rounded-lg shadow-md p-6">
                            <ProductsList
                                products={products}
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
