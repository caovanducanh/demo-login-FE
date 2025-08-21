import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../lib/apis/authApi";
import { tokenStorage } from "../lib/auth";
import { useToast } from "./use-toast";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { refreshTokenApi } from "../lib/apis/authRefresh";
import { decode as decodeJwt } from "../service/jwt";

// Đã chuyển sang service/jwt.ts

function useAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(!!tokenStorage.getToken());
  const [user, setUser] = useState<{ username: string; roles: string[]; refreshExp?: number } | null>(null);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);
  const [, setLocation] = useLocation();


  // Đảm bảo syncAuthState có thể gọi lại trong setTimeout
  const syncAuthStateRef = useRef<() => void>();
  function syncAuthState() {
    const token = tokenStorage.getToken();
    if (token) {
      const payload = decodeJwt(token);
      setUser({
        username: payload?.sub || "",
        roles: payload?.roles || [],
        refreshExp: payload?.refreshExp,
      });
      setIsAuthenticated(true);
      // Setup auto refresh
      setupAutoRefresh(token, payload);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    }
  }
  syncAuthStateRef.current = syncAuthState;
  useEffect(() => {
    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    return () => {
      window.removeEventListener("storage", syncAuthState);
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
    // eslint-disable-next-line
  }, []);

  // Hàm setup tự động refresh token
  function setupAutoRefresh(token: string, payload: any) {
    if (!payload?.exp || !payload?.refreshExp) return;
    const now = Date.now() / 1000;
    const exp = payload.exp;
    const refreshExp = payload.refreshExp / 1000;
    // Nếu refresh token đã hết hạn thì logout luôn
    if (now > refreshExp) {
      logout();
      return;
    }
    // Đặt timeout để refresh token trước khi hết hạn 30s
    const msToRefresh = Math.max((exp - now - 30) * 1000, 1000);
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    refreshTimeout.current = setTimeout(async () => {
      // Check lại refresh token trước khi refresh
      const currentToken = tokenStorage.getToken();
      const currentPayload = decodeJwt(currentToken);
      const now2 = Date.now() / 1000;
      if (!currentPayload?.refreshExp || now2 > currentPayload.refreshExp / 1000) {
        logout();
        return;
      }
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        const data = await refreshTokenApi(refreshToken);
        if (data?.accessToken) {
          tokenStorage.setToken(data.accessToken);
          if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
          // Gọi lại syncAuthState để cập nhật user và timeout mới
          if (syncAuthStateRef.current) syncAuthStateRef.current();
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }, msToRefresh);
  }

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data?.data?.token) {
        tokenStorage.setToken(data.data.token);
        if (data.data.refreshToken) localStorage.setItem("refreshToken", data.data.refreshToken);
        setIsAuthenticated(true);
        const payload = decodeJwt(data.data.token);
        setUser({
          username: payload?.sub || "",
          roles: payload?.roles || [],
          refreshExp: payload?.refreshExp,
        });
        setupAutoRefresh(data.data.token, payload);
        // Nếu là ADMIN thì chuyển sang dashboard
        if (payload?.roles?.includes("ADMIN")) {
          setLocation("/dashboard");
        } else {
          setLocation("/");
        }
      }
    },
  });

  const logout = () => {
    tokenStorage.removeToken();
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
    queryClient.clear();
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    setLocation("/login");
  };

  return { isAuthenticated, user, login, logout };
}

export { useAuth };
export default useAuth;
