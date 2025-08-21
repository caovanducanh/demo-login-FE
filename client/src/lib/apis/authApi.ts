import { apiRequest } from "../queryClient";
import type { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from "../../types/auth";
import type { UserInfo } from "../../types/user";
import { BASE_BACKEND_URL, API_BASE } from "../apis/base";

export const loginWithGoogle = async () => {
  window.location.href = `${BASE_BACKEND_URL}/oauth2/authorization/google`;
};


export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest("POST", `${API_BASE}/login`, credentials);
  return response.json();
}


export async function register(userData: UserInfo): Promise<UserInfo> {
  const response = await apiRequest("POST", `${API_BASE}/register`, userData);
  return response.json();
}


export async function refreshTokenApi(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await apiRequest("POST", `${API_BASE}/refresh-token`, {
    refreshToken,
  });
  return response.json();
}
