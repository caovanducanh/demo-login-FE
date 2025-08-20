export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
}

export interface User {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  identity_Card?: string;
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
  role: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  code: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}
