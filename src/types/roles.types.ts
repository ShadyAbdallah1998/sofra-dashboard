export type UserRole = 'admin' | 'moderator' | 'staff';

export interface RoleUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullname: string;
    email: string;
  };
  role: {
    id: string;
    type: string;
  };
}

export interface GetRoleUsersResponse {
  data: RoleUser[];
  metadata: {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

export interface AddUserRoleRequest {
  email: string;
  fullname: string;
  roleId: string;
}

export interface UpdateUserRoleRequest {
  roleId: string;
}

export interface Role {
  id: string;
  type: string;
  description: string;
}

export type GetRolesResponse = Role[];
