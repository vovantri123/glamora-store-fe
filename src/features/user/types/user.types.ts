export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface Role {
  name: string;
  description: string;
}

export interface User {
  id: number;
  fullName: string;
  gender: Gender;
  dob: string;
  email: string;
  avatar?: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateRequest {
  fullName: string;
  gender?: Gender;
  dob?: string;
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  fullName?: string;
  gender?: Gender;
  dob?: string;
  email: string;
  avatar?: string;
}

export interface UserRoleUpdateRequest {
  roleNames: string[];
}

export interface PasswordUpdateRequest {
  newPassword: string;
  oldPassword?: string;
}

export interface UsersParams {
  fullname?: string;
  dob?: string;
  isDeleted?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}
