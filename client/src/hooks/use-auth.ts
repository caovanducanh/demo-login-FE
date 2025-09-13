import { useQueryClient } from "@tanstack/react-query";
import { tokenStorage } from "../lib/auth";
import { useToast } from "./use-toast";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { refreshTokenApi } from "../lib/apis/authRefresh";
import { decode as decodeJwt } from "../service/jwt";

interface AuthUser {
  sub?: string;
  fullName?: string;
  username?: string; // Keep for backward compatibility
  email?: string;
  roles: string[];
  branchCode?: string;
  branchName?: string;
  refreshExp?: number;
}

function useAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(!!tokenStorage.getToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);
  const [, setLocation] = useLocation();

  // Đảm bảo syncAuthState có thể gọi lại trong setTimeout
  const syncAuthStateRef = useRef<() => void>();
  
  function syncAuthState() {
    const token = tokenStorage.getToken();
    if (token) {
      try {
        const payload = decodeJwt(token);
        setUser({
          sub: payload?.sub || "",
          fullName: payload?.fullName || payload?.name || payload?.sub || "",
          username: payload?.sub || "", // Keep for backward compatibility
          email: payload?.email || "",
          roles: payload?.roles || [],
          branchCode: payload?.branchCode,
          branchName: payload?.branchName,
          refreshExp: payload?.refreshExp,
        });
        setIsAuthenticated(true);
        // Setup auto refresh
        setupAutoRefresh(token, payload);
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
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

  // Handle OAuth2 callback from URL parameters
  const handleOAuth2Callback = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (error) {
      let errorMessage = "Đăng nhập thất bại";
      switch (error) {
        case "Email_not_allowed_for_selected_branch":
          errorMessage = "Email không được phép cho chi nhánh đã chọn";
          break;
        case "Branch_not_found":
          errorMessage = "Chi nhánh không tồn tại";
          break;
        case "Branch_parameter_required":
          errorMessage = "Vui lòng chọn chi nhánh trước khi đăng nhập";
          break;
        case "OAuth2_authentication_failed":
          errorMessage = "Xác thực Google thất bại";
          break;
        default:
          errorMessage = error.replace(/_/g, " ");
      }
      
      toast({
        title: "Lỗi đăng nhập",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Clear URL parameters and redirect to login
      window.history.replaceState({}, document.title, "/login");
      return;
    }

    if (token && refreshToken) {
      try {
        tokenStorage.setToken(token);
        localStorage.setItem("refreshToken", refreshToken);
        
        const payload = decodeJwt(token) as any;
        setUser({
          sub: payload.sub || "",
          fullName: payload.fullName || payload.name || payload.sub || "",
          email: payload.email || "",
          roles: payload.roles || [],
          branchCode: payload.branchCode,
          branchName: payload.branchName,
          refreshExp: payload.refreshExp,
        });
        setIsAuthenticated(true);
        setupAutoRefresh(token, payload);

        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Navigate based on role
        if (payload.roles && payload.roles.includes("ADMIN")) {
          setLocation("/dashboard");
        } else {
          setLocation("/home");
        }
        
      } catch (error) {
        console.error("Error processing OAuth2 callback:", error);
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi xử lý đăng nhập",
          variant: "destructive",
        });
        setLocation("/login");
      }
    }
  };

  const logout = () => {
    // Clear all auth-related storage
    tokenStorage.removeToken();
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("selectedBranch");
    localStorage.removeItem("HUMAN_VERIFY_TOKEN");
    
    // Clear state
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear query cache
    queryClient.clear();
    
    // Clear refresh timeout
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
      refreshTimeout.current = null;
    }
    
    // Force sync state to ensure everything is consistent
    // Do this after clearing storage to avoid race conditions
    setTimeout(() => {
      setLocation("/");
    }, 0);
  };

  return { 
    isAuthenticated, 
    user, 
    logout, 
    handleOAuth2Callback,
    syncAuthState 
  };
}

export { useAuth };
export default useAuth;
