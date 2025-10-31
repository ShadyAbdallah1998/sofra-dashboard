'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/products.types';

interface ProductsListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

export default function ProductsList({
    products,
    onEdit,
    onDelete,
    isLoading,
}: ProductsListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="fz-16 text-muted-foreground">No products found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                    {/* Product Image */}
                    {product.image && (
                        <div className="aspect-video bg-muted relative overflow-hidden">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {!product.isActive && (
                                <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded fz-12 font-medium z-10">
                                    Inactive
                                </div>
                            )}
                        </div>
                    )}

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                        <div>
                            <h3 className="fz-18 font-semibold text-foreground">{product.name}</h3>
                            {product.category && (
                                <p className="fz-12 text-muted-foreground">{product.category.name}</p>
                            )}
                        </div>

                        {product.description && (
                            <p className="fz-14 text-muted-foreground line-clamp-2">
                                {product.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="fz-20 font-bold text-foreground">${product.price.toFixed(2)}</p>
                                <p className="fz-12 text-muted-foreground">{product.calories} cal</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(product)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        if (confirm(`Delete "${product.name}"?`)) {
                                            onDelete(product.id);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                            <p className="fz-12 text-muted-foreground">
                                Order: {product.order} • Created by {product.createdBy}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
