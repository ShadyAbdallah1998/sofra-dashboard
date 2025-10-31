'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/categories.types';

const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    isActive: z.boolean(),
    order: z.number().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    category?: Category;
    onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    userEmail: string;
}

export default function CategoryForm({
    category,
    onSubmit,
    onCancel,
    isLoading,
    userEmail,
}: CategoryFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: category
            ? {
                name: category.name,
                description: category.description || '',
                image: category.image || '',
                isActive: category.isActive,
                order: category.order,
            }
            : {
                name: '',
                description: '',
                image: '',
                isActive: true,
                order: 0,
            },
    });

    const isActive = watch('isActive');

    const handleFormSubmit = async (data: CategoryFormData) => {
        if (category) {
            // Update
            await onSubmit({
                name: data.name,
                isActive: data.isActive,
                description: data.description,
                image: data.image,
                order: data.order,
                updatedBy: userEmail,
            } as UpdateCategoryRequest);
        } else {
            // Create
            await onSubmit({
                ...data,
                createdBy: userEmail,
            } as CreateCategoryRequest);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block fz-14 font-medium text-foreground">
                        Category Name *
                    </label>
                    <Input
                        {...register('name')}
                        id="name"
                        type="text"
                        placeholder="Enter category name"
                        className="fz-14"
                    />
                    {errors.name && (
                        <p className="fz-12 text-destructive">{errors.name.message}</p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block fz-14 font-medium text-foreground">
                        Description
                    </label>
                    <textarea
                        {...register('description')}
                        id="description"
                        rows={3}
                        placeholder="Enter category description"
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground fz-14"
                    />
                    {errors.description && (
                        <p className="fz-12 text-destructive">{errors.description.message}</p>
                    )}
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                    <label htmlFor="image" className="block fz-14 font-medium text-foreground">
                        Image URL
                    </label>
                    <Input
                        {...register('image')}
                        id="image"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="fz-14"
                    />
                    {errors.image && (
                        <p className="fz-12 text-destructive">{errors.image.message}</p>
                    )}
                </div>

                {/* Order */}
                <div className="space-y-2">
                    <label htmlFor="order" className="block fz-14 font-medium text-foreground">
                        Display Order
                    </label>
                    <Input
                        {...register('order', { valueAsNumber: true })}
                        id="order"
                        type="number"
                        placeholder="0"
                        className="fz-14"
                    />
                    {errors.order && (
                        <p className="fz-12 text-destructive">{errors.order.message}</p>
                    )}
                </div>

                {/* Is Active */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="isActive"
                        checked={isActive}
                        onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
                    />
                    <label
                        htmlFor="isActive"
                        className="fz-14 text-foreground cursor-pointer select-none"
                    >
                        Active (visible to customers)
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    className="fz-16 font-medium"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
