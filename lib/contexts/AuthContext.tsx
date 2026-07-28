"use client";
import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from "react";
import { clearAuthCookies, getTokenCookie, getUserData } from "../cookies";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
  contactNumber?: string;
  phone?: string;
  gender?: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: AuthUser | null;
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
  logout: () => Promise<void>;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const token = await getTokenCookie();
      const userData = await getUserData();
      setUser(userData as AuthUser | null);
      setIsAuthenticated(!!token);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await checkAuth();
    };
    run().finally(() => {
      if (cancelled) return;
    });
    return () => { cancelled = true; };
  }, []);

  const logout = async () => {
    try {
      await clearAuthCookies();
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
