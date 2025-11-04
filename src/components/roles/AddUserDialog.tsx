'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import type { AddUserRoleRequest, Role } from '@/types/roles.types';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddUserRoleRequest) => Promise<void>;
  roles: Role[];
  isLoading?: boolean;
}

export function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
  roles,
  isLoading = false,
}: AddUserDialogProps) {
  const t = useTranslations('RolesManagement');
  const tValidation = useTranslations('validation');

  const schema = z.object({
    email: z.string().email(tValidation('invalidEmail')),
    fullname: z.string().min(1, tValidation('invalidInput')),
    roleId: z.string().min(1, tValidation('invalidInput')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddUserRoleRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      fullname: '',
      roleId: '',
    },
  });

  const handleFormSubmit = async (data: AddUserRoleRequest) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-[500px] mx-4 bg-background rounded-xl shadow-lg border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="fz-20 font-semibold">{t('createUser')}</h2>
            <p className="fz-14 text-muted-foreground mt-1">{t('subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullname" className="fz-14 font-medium block">
              {t('fullname')}
            </label>
            <Input
              id="fullname"
              type="text"
              placeholder={t('fullnamePlaceholder')}
              {...register('fullname')}
              className="fz-14"
              disabled={isLoading}
            />
            {errors.fullname && (
              <p className="fz-12 text-destructive">{errors.fullname.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="fz-14 font-medium block">
              {t('email')}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              {...register('email')}
              className="fz-14"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="fz-12 text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label htmlFor="roleId" className="fz-14 font-medium block">
              {t('role')}
            </label>
            <select
              id="roleId"
              {...register('roleId')}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 fz-14 ring-offset-background file:border-0 file:bg-transparent file:fz-14 file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t('selectRole')}</option>
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.type}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="fz-12 text-destructive">{errors.roleId.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="fz-14"
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="fz-14">
              {isLoading ? t('saving') : t('save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
