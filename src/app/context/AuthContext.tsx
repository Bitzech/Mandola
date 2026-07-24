import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, clearAuthStorage } from "../services/api";

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
  [key: string]: any;
}

export function getRoleFromId(roleId?: number | string | null): Role {
  const id = Number(roleId);
  if (id === 1) return "admin";
  if (id === 2) return "seller";
  return "customer";
}

export function getIdFromRole(role?: Role | null): number {
  if (role === "admin") return 1;
  if (role === "seller") return 2;
  return 3;
}

interface AuthContextType {
  user: AuthUser | null;
  role: Role | null;
  roleId: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    confirm_password?: string;
  }) => Promise<any>;
  sendOTP: (identifier: string, type?: string) => Promise<any>;
  verifyOTP: (identifier: string, otp: string, type?: string) => Promise<any>;
  refreshToken: () => Promise<any>;
  logout: () => void;
  saveAuthSession: (data: {
    accessToken?: string;
    refreshToken?: string;
    user?: AuthUser;
    roleId?: number | string;
    role?: Role;
  }) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session from localStorage on initial load
  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("mandola_user");
      const storedRoleId = localStorage.getItem("mandola_role_id");
      const storedRole = localStorage.getItem("mandola_role");

      if (accessToken) {
        let u: AuthUser | null = null;
        if (storedUser) {
          try {
            u = JSON.parse(storedUser);
          } catch {
            u = null;
          }
        }

        let rId: number = storedRoleId ? Number(storedRoleId) : u?.role_id ? Number(u.role_id) : 3;
        let rName: Role = storedRole ? (storedRole as Role) : u?.role ? u.role : getRoleFromId(rId);

        setUser(u || { role: rName, role_id: rId });
        setRole(rName);
        setRoleId(rId);
        setIsAuthenticated(true);
      } else {
        // Migration fallback for previous simple session state
        const legacy = sessionStorage.getItem("mandola_auth");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            if (parsed?.role) {
              const rName: Role = parsed.role;
              const rId = getIdFromRole(rName);
              setUser(parsed);
              setRole(rName);
              setRoleId(rId);
              setIsAuthenticated(true);
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (e) {
      console.error("Failed to restore session", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAuthSession = (data: {
    accessToken?: string;
    refreshToken?: string;
    user?: AuthUser;
    roleId?: number | string;
    role?: Role;
  }) => {
    const { accessToken, refreshToken, user: u, roleId: rId, role: rName } = data;

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    const calculatedRoleId = rId ? Number(rId) : u?.role_id ? Number(u.role_id) : roleId || 3;
    const calculatedRole = rName || u?.role || getRoleFromId(calculatedRoleId);

    const userObj: AuthUser = u
      ? { ...u, role: calculatedRole, role_id: calculatedRoleId }
      : user
      ? { ...user, role: calculatedRole, role_id: calculatedRoleId }
      : { role: calculatedRole, role_id: calculatedRoleId };

    localStorage.setItem("mandola_user", JSON.stringify(userObj));
    localStorage.setItem("mandola_role_id", String(calculatedRoleId));
    localStorage.setItem("mandola_role", calculatedRole);

    // Keep legacy fallback synced
    sessionStorage.setItem("mandola_auth", JSON.stringify(userObj));

    setUser(userObj);
    setRole(calculatedRole);
    setRoleId(calculatedRoleId);
    setIsAuthenticated(true);
  };

  const login = async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/login", credentials);
    const data = response.data;

    // Standardize token & user extraction
    const resData = data.data || data;
    const accessToken = resData.access_token || resData.accessToken || resData.tokens?.access_token || data.access_token;
    const refreshTokenValue = resData.refresh_token || resData.refreshToken || resData.tokens?.refresh_token || data.refresh_token;
    const userObj = resData.user || resData.user_info || data.user;
    const userRoleId = resData.role_id || userObj?.role_id || resData.role || userObj?.role || 3;

    if (accessToken) {
      saveAuthSession({
        accessToken,
        refreshToken: refreshTokenValue,
        user: userObj,
        roleId: userRoleId,
      });
    }

    return data;
  };

  const register = async (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    confirm_password?: string;
  }) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
  };

  const sendOTP = async (identifier: string, type: string = "verify_email") => {
    const response = await api.post("/auth/send-otp", {
      identifier,
      type,
    });
    return response.data;
  };

  const verifyOTP = async (identifier: string, otp: string, type: string = "verify_email") => {
    const response = await api.post("/auth/verify-otp", {
      identifier,
      otp,
      type,
    });
    const data = response.data;
    const resData = data.data || data;

    const accessToken = resData.access_token || resData.accessToken || resData.tokens?.access_token || data.access_token;
    const refreshTokenValue = resData.refresh_token || resData.refreshToken || resData.tokens?.refresh_token || data.refresh_token;
    const userObj = resData.user || resData.user_info || data.user;
    const userRoleId = resData.role_id || userObj?.role_id || 3;

    if (accessToken) {
      saveAuthSession({
        accessToken,
        refreshToken: refreshTokenValue,
        user: userObj,
        roleId: userRoleId,
      });
    }

    return data;
  };

  const refreshToken = async () => {
    const storedRefresh = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");
    if (!storedRefresh) {
      throw new Error("No refresh token available");
    }
    const response = await api.post("/auth/refresh-token", {
      refresh_token: storedRefresh,
    });
    const data = response.data;
    const resData = data.data || data;
    const newAccess = resData.access_token || resData.accessToken || data.access_token;
    const newRefresh = resData.refresh_token || resData.refreshToken || data.refresh_token || storedRefresh;

    if (newAccess) {
      localStorage.setItem("access_token", newAccess);
      localStorage.setItem("refresh_token", newRefresh);
    }
    return data;
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    setRole(null);
    setRoleId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        roleId,
        isAuthenticated,
        loading,
        login,
        register,
        sendOTP,
        verifyOTP,
        refreshToken,
        logout,
        saveAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
