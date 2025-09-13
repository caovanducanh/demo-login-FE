// Định nghĩa type cho Auth API
// Traditional login removed - Only OAuth2 Google authentication

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// OAuth2 authentication response
export interface OAuth2AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    username: string;
    email: string;
    roles: string[];
    branchCode?: string;
    branchName?: string;
  };
}
