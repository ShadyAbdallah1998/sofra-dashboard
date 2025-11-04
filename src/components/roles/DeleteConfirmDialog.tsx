'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import type { RoleUser } from '@/types/roles.types';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: RoleUser | null;
  onConfirm: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const t = useTranslations('RolesManagement');

  const handleConfirm = async () => {
    if (!user) return;
    await onConfirm(user.user.id);
    onOpenChange(false);
  };

  const handleClose = () => {
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
      <div className="relative z-10 w-full max-w-[450px] mx-4 bg-background rounded-xl shadow-lg border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="fz-18 font-semibold">{t('deleteUser')}</h2>
            </div>
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="fz-14 text-muted-foreground">
            {t('deleteConfirm', { name: user.user.fullname })}
          </p>
          <p className="fz-14 text-muted-foreground">
            {t('deleteWarning')}
          </p>

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="space-y-1">
              <p className="fz-14 font-medium">{user.user.fullname}</p>
              <p className="fz-12 text-muted-foreground">{user.user.email}</p>
              <p className="fz-12 text-muted-foreground">
                {t('role')}: {user.role.type}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="fz-14"
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="fz-14"
          >
            {isLoading ? t('deleting') : t('delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}
