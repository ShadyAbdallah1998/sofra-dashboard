'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types/categories.types';

interface CategoriesListProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

export default function CategoriesList({
    categories,
    onEdit,
    onDelete,
    isLoading,
}: CategoriesListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="fz-16 text-muted-foreground">No categories found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
                <div
                    key={category.id}
                    className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                    {/* Category Image */}
                    {category.image && (
                        <div className="aspect-video bg-muted relative overflow-hidden">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {!category.isActive && (
                                <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded fz-12 font-medium z-10">
                                    Inactive
                                </div>
                            )}
                        </div>
                    )}

                    {/* Category Info */}
                    <div className="p-4 space-y-3">
                        <div>
                            <h3 className="fz-18 font-semibold text-foreground">{category.name}</h3>
                        </div>

                        {category.description && (
                            <p className="fz-14 text-muted-foreground line-clamp-2">
                                {category.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(category)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        if (confirm(`Delete "${category.name}"?`)) {
                                            onDelete(category.id);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                            <p className="fz-12 text-muted-foreground">
                                Order: {category.order} • Created by {category.createdBy}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
