import { apiRequest } from "../queryClient";
import type { RefreshTokenRequest, RefreshTokenResponse } from "../../types/auth";
import { BASE_BACKEND_URL, API_BASE } from "../apis/base";

// Traditional login and registration are removed
// Only OAuth2 Google authentication with branch selection is supported


export async function refreshTokenApi(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await apiRequest("POST", `${API_BASE}/refresh-token`, {
    refreshToken,
  });
  return response.json();
}
