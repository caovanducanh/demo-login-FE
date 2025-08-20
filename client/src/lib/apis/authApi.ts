import { apiRequest } from "../queryClient";
import type { ApiResponse, AuthResponse, User } from "../../types/api";
import { BASE_BACKEND_URL, API_BASE } from "../apis/base";

export const loginWithGoogle = async () => {
  window.location.href = `${BASE_BACKEND_URL}/oauth2/authorization/google`;
};

export const login = async (
  credentials: { username: string; password: string }
): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiRequest("POST", `${API_BASE}/login`, credentials);
  return response.json();
};

export const register = async (
  userData: any
): Promise<ApiResponse<User>> => {
  const response = await apiRequest("POST", `${API_BASE}/register`, userData);
  return response.json();
};

export const refreshToken = async (
  refreshToken: string
): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiRequest("POST", `${API_BASE}/refresh-token`, {
    refreshToken,
  });
  return response.json();
};
