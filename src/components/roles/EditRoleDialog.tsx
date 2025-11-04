'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { UpdateUserRoleRequest, RoleUser, Role } from '@/types/roles.types';

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: RoleUser | null;
  roles: Role[];
  onSubmit: (id: string, data: UpdateUserRoleRequest) => Promise<void>;
  isLoading?: boolean;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  user,
  roles,
  onSubmit,
  isLoading = false,
}: EditRoleDialogProps) {
  const t = useTranslations('RolesManagement');
  const tValidation = useTranslations('validation');

  const schema = z.object({
    roleId: z.string().min(1, tValidation('invalidInput')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateUserRoleRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      roleId: '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('roleId', user.role.id);
    }
  }, [user, setValue]);

  const handleFormSubmit = async (data: UpdateUserRoleRequest) => {
    if (!user) return;
    await onSubmit(user.user.id, data);
    reset();
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (!open || !user) return null;

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
            <h2 className="fz-20 font-semibold">{t('updateRole')}</h2>
            <p className="fz-14 text-muted-foreground mt-1">
              {user.user.fullname} ({user.user.email})
            </p>
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
