'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useRolesStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { Shield, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { AddUserDialog } from '@/components/roles/AddUserDialog';
import { EditRoleDialog } from '@/components/roles/EditRoleDialog';
import { DeleteConfirmDialog } from '@/components/roles/DeleteConfirmDialog';
import type { RoleUser, AddUserRoleRequest, UpdateUserRoleRequest } from '@/types/roles.types';
import { format } from 'date-fns';

export default function UserRolesPage() {
  const t = useTranslations('RolesManagement');
  const router = useRouter();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<RoleUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<RoleUser | null>(null);

  const user = useAuthStore((state) => state.user);
  const roleUsers = useRolesStore((state) => state.roleUsers);
  const roles = useRolesStore((state) => state.roles);
  const isLoading = useRolesStore((state) => state.isLoading);
  const error = useRolesStore((state) => state.error);
  const pagination = useRolesStore((state) => state.pagination);
  const currentPage = useRolesStore((state) => state.currentPage);
  const getRoles = useRolesStore((state) => state.getRoles);
  const getRoleUsers = useRolesStore((state) => state.getRoleUsers);
  const addUserRole = useRolesStore((state) => state.addUserRole);
  const updateUserRole = useRolesStore((state) => state.updateUserRole);
  const deleteUserRole = useRolesStore((state) => state.deleteUserRole);
  const setPage = useRolesStore((state) => state.setPage);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    getRoles();
    getRoleUsers();

    return () => {
      useRolesStore.getState().reset();
    };
  }, [user, getRoles, getRoleUsers, router]);

  const handleAddUser = async (data: AddUserRoleRequest) => {
    const result = await addUserRole(data);
    if (result.success) {
      setShowAddDialog(false);
    }
  };

  const handleEditRole = async (id: string, data: UpdateUserRoleRequest) => {
    const result = await updateUserRole(id, data);
    if (result.success) {
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const result = await deleteUserRole(id);
    if (result.success) {
      setDeletingUser(null);
    }
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  if (!user) {
    return null;
  }

  const columns = [
    {
      key: 'fullname',
      header: t('fullname'),
      sortable: false,
      className: 'min-w-[200px]',
      headerClassName: 'min-w-[200px]',
      render: (roleUser: RoleUser) => (
        <p className="fz-14 font-semibold text-foreground">{roleUser.user.fullname}</p>
      ),
    },
    {
      key: 'email',
      header: t('email'),
      sortable: false,
      className: 'min-w-[250px]',
      headerClassName: 'min-w-[250px]',
      render: (roleUser: RoleUser) => (
        <p className="fz-14 text-muted-foreground">{roleUser.user.email}</p>
      ),
    },
    {
      key: 'role',
      header: t('role'),
      sortable: false,
      className: 'w-[150px]',
      headerClassName: 'w-[150px]',
      render: (roleUser: RoleUser) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full fz-12 font-medium bg-primary/10 text-primary border border-primary/20 shadow-sm">
          {roleUser.role.type}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: t('createdAt'),
      sortable: false,
      className: 'w-[150px]',
      headerClassName: 'w-[150px]',
      render: (roleUser: RoleUser) => (
        <p className="fz-12 text-muted-foreground">
          {format(new Date(roleUser.createdAt), 'MMM dd, yyyy')}
        </p>
      ),
    },
  ];

  const actions = [
    {
      label: t('edit'),
      onClick: (roleUser: RoleUser) => setEditingUser(roleUser),
      variant: 'outline' as const,
      icon: <Edit className="h-3 w-3" />,
    },
    {
      label: t('delete'),
      onClick: (roleUser: RoleUser) => setDeletingUser(roleUser),
      variant: 'destructive' as const,
      icon: <Trash2 className="h-3 w-3" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="fz-25 font-bold text-foreground flex items-center gap-3">
            <Shield className="h-7 w-7 text-primary" />
            {t('title')}
          </h1>
          <p className="fz-14 text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          {t('addUser')}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-xl p-4 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="fz-14 font-semibold text-destructive">{t('errors.loadFailed')}</p>
            <p className="fz-12 text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
        <DataTable
          data={roleUsers || []}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          emptyMessage={t('noUsers')}
          keyExtractor={(roleUser) => roleUser.id}
        />
      </div>

      {/* Pagination */}
      {pagination && pagination.lastPage > 1 && (
        <div className="flex items-center justify-between bg-card text-card-foreground rounded-xl shadow-sm border border-border p-4">
          <p className="fz-14 text-muted-foreground">
            {t('showingPage', {
              page: pagination.page,
              lastPage: pagination.lastPage,
              total: pagination.total,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="shadow-sm"
            >
              {t('previous')}
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.lastPage || isLoading}
              className="shadow-sm"
            >
              {t('next')}
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <AddUserDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddUser}
        roles={roles}
        isLoading={isLoading}
      />
      <EditRoleDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
        roles={roles}
        onSubmit={handleEditRole}
        isLoading={isLoading}
      />
      <DeleteConfirmDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        user={deletingUser}
        onConfirm={handleDeleteUser}
        isLoading={isLoading}
      />
    </div>
  );
}
