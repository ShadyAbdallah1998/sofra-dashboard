'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types/products.types';
import { useTranslations } from 'next-intl';

const productSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    price: z.number().min(0, 'Price must be positive'),
    categoryId: z.string().min(1, 'Category is required'),
    calories: z.number().min(0, 'Calories must be positive'),
    description: z.string().optional(),
    image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    isActive: z.boolean(),
    order: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
    product?: Product;
    categories: Array<{ id: string; name: string }>;
    onSubmit: (data: CreateProductRequest | UpdateProductRequest) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    userEmail: string;
}

export default function ProductForm({
    product,
    categories,
    onSubmit,
    onCancel,
    isLoading,
    userEmail,
}: ProductFormProps) {
    const t = useTranslations('Products.form');
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: product
            ? {
                name: product.name,
                price: product.price,
                categoryId: product.categoryId,
                calories: product.calories,
                description: product.description || '',
                image: product.image || '',
                isActive: product.isActive,
                order: product.order,
            }
            : {
                name: '',
                price: 0,
                categoryId: '',
                calories: 0,
                description: '',
                image: '',
                isActive: true,
                order: 0,
            },
    });

    const isActive = watch('isActive');

    const handleFormSubmit = async (data: ProductFormData) => {
        if (product) {
            // Update
            await onSubmit({
                name: data.name,
                isActive: data.isActive,
                calories: data.calories,
                description: data.description,
                image: data.image,
                order: data.order,
                updatedBy: userEmail,
            } as UpdateProductRequest);
        } else {
            // Create
            await onSubmit({
                ...data,
                createdBy: userEmail,
            } as CreateProductRequest);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block fz-14 font-medium text-foreground">
                        {t('productName')} {t('required')}
                    </label>
                    <Input
                        {...register('name')}
                        id="name"
                        type="text"
                        placeholder={t('productNamePlaceholder')}
                        className="fz-14"
                    />
                    {errors.name && (
                        <p className="fz-12 text-destructive">{errors.name.message}</p>
                    )}
                </div>

                {/* Price & Calories */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="price" className="block fz-14 font-medium text-foreground">
                            {t('price')} {t('required')}
                        </label>
                        <Input
                            {...register('price', { valueAsNumber: true })}
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder={t('pricePlaceholder')}
                            className="fz-14"
                        />
                        {errors.price && (
                            <p className="fz-12 text-destructive">{errors.price.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="calories" className="block fz-14 font-medium text-foreground">
                            {t('calories')} {t('required')}
                        </label>
                        <Input
                            {...register('calories', { valueAsNumber: true })}
                            id="calories"
                            type="number"
                            placeholder={t('caloriesPlaceholder')}
                            className="fz-14"
                        />
                        {errors.calories && (
                            <p className="fz-12 text-destructive">{errors.calories.message}</p>
                        )}
                    </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label htmlFor="categoryId" className="block fz-14 font-medium text-foreground">
                        {t('category')} {t('required')}
                    </label>
                    <select
                        {...register('categoryId')}
                        id="categoryId"
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground fz-14"
                        disabled={!!product}
                    >
                        <option value="">{t('categoryPlaceholder')}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && (
                        <p className="fz-12 text-destructive">{errors.categoryId.message}</p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block fz-14 font-medium text-foreground">
                        {t('description')}
                    </label>
                    <textarea
                        {...register('description')}
                        id="description"
                        rows={3}
                        placeholder={t('descriptionPlaceholder')}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground fz-14"
                    />
                    {errors.description && (
                        <p className="fz-12 text-destructive">{errors.description.message}</p>
                    )}
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                    <label htmlFor="image" className="block fz-14 font-medium text-foreground">
                        {t('imageUrl')}
                    </label>
                    <Input
                        {...register('image')}
                        id="image"
                        type="url"
                        placeholder={t('imageUrlPlaceholder')}
                        className="fz-14"
                    />
                    {errors.image && (
                        <p className="fz-12 text-destructive">{errors.image.message}</p>
                    )}
                </div>

                {/* Order */}
                <div className="space-y-2">
                    <label htmlFor="order" className="block fz-14 font-medium text-foreground">
                        {t('displayOrder')}
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
                        {t('activeLabel')}
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
                    {isLoading ? t('saving') : product ? t('updateButton') : t('createButton')}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    {t('cancel')}
                </Button>
            </div>
        </form>
    );
}
