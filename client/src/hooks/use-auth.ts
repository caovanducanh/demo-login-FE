import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import { tokenStorage } from "../lib/auth";
import { useToast } from "./use-toast";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

function parseJwt(token: string | null): any {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function useAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(!!tokenStorage.getToken());
  const [user, setUser] = useState<{ username: string; roles: string[] } | null>(null);
  const [, setLocation] = useLocation();


  useEffect(() => {
    function syncAuthState() {
      const token = tokenStorage.getToken();
      if (token) {
        const payload = parseJwt(token);
        setUser({
          username: payload?.sub || "",
          roles: payload?.roles || [],
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data?.data?.token) {
        tokenStorage.setToken(data.data.token);
        setIsAuthenticated(true);
        const payload = parseJwt(data.data.token);
        setUser({
          username: payload?.sub || "",
          roles: payload?.roles || [],
        });
        toast({ title: "Đăng nhập thành công" });
        // Nếu là ADMIN thì chuyển sang dashboard
        if (payload?.roles?.includes("ADMIN")) {
          setLocation("/dashboard");
        } else {
          setLocation("/");
        }
      }
    },
    onError: (error: any) => {
      toast({ title: "Đăng nhập thất bại", description: error.message, variant: "destructive" });
    },
  });

  const logout = () => {
    tokenStorage.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    queryClient.clear();
    setLocation("/login");
  };

  return { isAuthenticated, user, login, logout };
}

export { useAuth };
export default useAuth;
