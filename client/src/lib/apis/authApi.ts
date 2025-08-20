export const loginWithGoogle = async () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};
import { apiRequest } from "../queryClient";
import type { ApiResponse, AuthResponse, User } from "../../types/api";

const API_BASE = "http://localhost:8080/api";

export const login = async (credentials: { username: string; password: string }): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiRequest("POST", `${API_BASE}/login`, credentials);
  return response.json();
};

export const register = async (userData: any): Promise<ApiResponse<User>> => {
  const response = await apiRequest("POST", `${API_BASE}/register`, userData);
  return response.json();
};

export const refreshToken = async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiRequest("POST", `${API_BASE}/refresh-token`, { refreshToken });
  return response.json();
};
