export type UserRole = 'admin' | 'moderator' | 'staff';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  fullname: string;
  joinedAt: string;
  lastUpdatedAt: string;
  firstname?: string;
  lastname?: string;
  picture?: string;
  role?: UserRole;
}

export type GetUserResponse = User;

export interface UpdateUserRequest {
  fullname?: string;
  firstname?: string;
  lastname?: string;
  picture?: string;
}
