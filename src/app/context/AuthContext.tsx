import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/auth.service";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { AuthUser, Role, LoginCredentials, RegisterPayload } from "../types/auth.types";
import ProfileOTPModal from "../components/ProfileOTPModal";

export type { Role, AuthUser };

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
  login: (credentials: LoginCredentials) => Promise<any>;
  register: (payload: RegisterPayload) => Promise<any>;
  sendOTP: (identifier: string, type?: string) => Promise<any>;
  verifyOTP: (identifier: string, otp: string, type?: string) => Promise<any>;
  refreshToken: () => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (payload: { identifier?: string; token?: string; new_password?: string; password?: string; confirm_password?: string }) => Promise<any>;
  updateProfile: (payload: Partial<AuthUser>) => Promise<any>;
  changePassword: (payload: { current_password?: string; new_password?: string; confirm_password?: string }) => Promise<any>;
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

  const [pendingVerification, setPendingVerification] = useState<{
    identifier: string;
    type: "verify_email" | "verify_phone";
  } | null>(() => {
    try {
      const stored = localStorage.getItem("MANDOLA_PENDING_VERIFICATION");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Keep pendingVerification synced with localStorage
  useEffect(() => {
    if (pendingVerification) {
      localStorage.setItem("MANDOLA_PENDING_VERIFICATION", JSON.stringify(pendingVerification));
    } else {
      localStorage.removeItem("MANDOLA_PENDING_VERIFICATION");
    }
  }, [pendingVerification]);

  // Auto-detect unverified profile state on app load/restore
  useEffect(() => {
    if (user && isAuthenticated && !loading) {
      if (!pendingVerification) {
        const isEmailUnver =
          user.email_verified_at === null ||
          user.email_verified_at === undefined ||
          user.email_verified_at === false;
        const isPhoneUnver =
          user.phone_verified === 0 ||
          user.phone_verified === false ||
          user.phone_verified === "0";

        if (isEmailUnver && user.email) {
          const verObj = { identifier: user.email, type: "verify_email" as const };
          setPendingVerification(verObj);
        } else if (isPhoneUnver && user.phone) {
          const verObj = { identifier: user.phone, type: "verify_phone" as const };
          setPendingVerification(verObj);
        }
      }
    }
  }, [user, isAuthenticated, loading]);

  // Synchronize auth state and persist to local storage
  const saveAuthSession = (data: {
    accessToken?: string;
    refreshToken?: string;
    user?: AuthUser;
    roleId?: number | string;
    role?: Role;
  }) => {
    const { accessToken, refreshToken, user: u, roleId: rId, role: rName } = data;

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    const calculatedRoleId = rId !== undefined && rId !== null ? Number(rId) : u?.role_id !== undefined && u?.role_id !== null ? Number(u.role_id) : roleId || 3;
    const calculatedRole = rName || u?.role || getRoleFromId(calculatedRoleId);

    const userObj: AuthUser = u
      ? { ...u, role: calculatedRole, role_id: calculatedRoleId }
      : user
      ? { ...user, role: calculatedRole, role_id: calculatedRoleId }
      : { role: calculatedRole, role_id: calculatedRoleId };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
    localStorage.setItem(STORAGE_KEYS.ROLE_ID, String(calculatedRoleId));
    localStorage.setItem(STORAGE_KEYS.ROLE, calculatedRole);

    sessionStorage.setItem(STORAGE_KEYS.LEGACY_AUTH, JSON.stringify(userObj));

    setUser(userObj);
    setRole(calculatedRole);
    setRoleId(calculatedRoleId);
    setIsAuthenticated(true);
  };

  // Restore session on app load and verify profile against backend
  useEffect(() => {
    async function initAuth() {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedRoleId = localStorage.getItem(STORAGE_KEYS.ROLE_ID);
        const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE);

        if (accessToken) {
          let u: AuthUser | null = null;
          if (storedUser) {
            try {
              u = JSON.parse(storedUser);
            } catch {
              u = null;
            }
          }

          const rId: number = storedRoleId ? Number(storedRoleId) : u?.role_id ? Number(u.role_id) : 3;
          const rName: Role = storedRole ? (storedRole as Role) : u?.role ? u.role : getRoleFromId(rId);

          setUser(u || { role: rName, role_id: rId });
          setRole(rName);
          setRoleId(rId);
          setIsAuthenticated(true);

          // Silent sync with backend GET /auth/me or GET /auth/profile
          try {
            const profileRes = await authService.getMe();
            const liveUser = profileRes.data || profileRes;
            if (liveUser && typeof liveUser === "object") {
              const liveRoleId = liveUser.role_id || rId;
              const liveRole = getRoleFromId(liveRoleId);
              saveAuthSession({
                accessToken,
                user: liveUser,
                roleId: liveRoleId,
                role: liveRole,
              });
            }
          } catch (syncErr) {
            // Keep local session if transient network error
          }
        } else {
          const legacy = sessionStorage.getItem(STORAGE_KEYS.LEGACY_AUTH);
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
    }

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    const resData = data.data || data;

    const accessToken =
      resData.access_token || resData.accessToken || resData.tokens?.access_token || data.access_token;
    const refreshTokenValue =
      resData.refresh_token || resData.refreshToken || resData.tokens?.refresh_token || data.refresh_token;
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

  const register = async (payload: RegisterPayload) => {
    return await authService.register(payload);
  };

  const sendOTP = async (identifier: string, type = "verify_email") => {
    return await authService.sendOTP(identifier, type);
  };

  const verifyOTP = async (identifier: string, otp: string, type = "verify_email") => {
    const data = await authService.verifyOTP(identifier, otp, type);
    const resData = data.data || data;

    if (resData?.requires_verification) {
      const isPhoneVer = resData.verify_phone && !resData.verify_email;
      const targetType = isPhoneVer ? "verify_phone" : "verify_email";
      const targetIdentifier = resData.identifier || identifier;
      const verObj = { identifier: targetIdentifier, type: targetType as "verify_email" | "verify_phone" };
      setPendingVerification(verObj);
    } else {
      setPendingVerification(null);
    }

    const accessToken =
      resData.access_token || resData.accessToken || resData.tokens?.access_token || data.access_token;
    const refreshTokenValue =
      resData.refresh_token || resData.refreshToken || resData.tokens?.refresh_token || data.refresh_token;
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
    const storedRefresh =
      localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!storedRefresh) {
      throw new Error("No refresh token available");
    }
    const data = await authService.refreshToken(storedRefresh);
    const resData = data.data || data;
    const newAccess = resData.access_token || resData.accessToken || data.access_token;
    const newRefresh = resData.refresh_token || resData.refreshToken || data.refresh_token || storedRefresh;

    if (newAccess) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccess);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefresh);
    }
    return data;
  };

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (payload: { identifier?: string; token?: string; new_password?: string; password?: string; confirm_password?: string }) => {
    return await authService.resetPassword(payload);
  };

  const updateProfile = async (payload: Partial<AuthUser>) => {
    const data = await authService.updateProfile(payload);
    const resData = data.data || data;

    if (resData && typeof resData === "object") {
      if (resData.requires_verification) {
        const isPhoneVer = resData.verify_phone && !resData.verify_email;
        const targetType = isPhoneVer ? "verify_phone" : "verify_email";
        const targetIdentifier = resData.identifier || (isPhoneVer ? payload.phone : payload.email);

        if (targetIdentifier) {
          const verObj = { identifier: targetIdentifier, type: targetType as "verify_email" | "verify_phone" };
          setPendingVerification(verObj);
        }
      }

      const userPayload = resData.user || (resData.requires_verification ? null : resData);
      if (userPayload) {
        const mergedUser = { ...user, ...userPayload };
        setUser(mergedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mergedUser));
      }
    }
    return data;
  };

  const changePassword = async (payload: { current_password?: string; new_password?: string; confirm_password?: string }) => {
    return await authService.changePassword(payload);
  };

  const logout = async () => {
    await authService.logout();
    setPendingVerification(null);
    localStorage.removeItem("MANDOLA_PENDING_VERIFICATION");
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
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        logout,
        saveAuthSession,
      }}
    >
      {children}
      {pendingVerification && (
        <ProfileOTPModal
          isOpen={true}
          onClose={() => {}}
          initialIdentifier={pendingVerification.identifier}
          initialType={pendingVerification.type}
          onSuccess={() => {
            setPendingVerification(null);
          }}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

