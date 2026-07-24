export type Role = "customer" | "seller" | "admin";

export interface AuthUser {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  role_id?: number;
  role?: Role;
  avatar?: string;
  gender?: string;
  dob?: string;
  [key: string]: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  confirm_password?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
}

export interface AuthSessionData {
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
  roleId?: number | string;
  role?: Role;
}
