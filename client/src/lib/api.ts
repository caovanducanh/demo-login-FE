// --- PROFILE API ---
export async function fetchCurrentUser() {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/users/me`);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy thông tin user');
  return data.data;
}
// --- SECURITY MANAGEMENT API ---
export async function unlockAccount(userId: number) {
  const res = await apiRequest("POST", `${BASE_BACKEND_URL}/api/admin/security/unlock-account/${userId}`);
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi mở khóa tài khoản');
  return data;
}

export async function lockAccount(userId: number, reason: string) {
  const res = await apiRequest("POST", `${BASE_BACKEND_URL}/api/admin/security/lock-account/${userId}`, { reason });
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi khóa tài khoản');
  return data;
}

export async function changeUserStatus(userId: number, status: string, reason: string) {
  const res = await apiRequest("PUT", `${BASE_BACKEND_URL}/api/admin/security/change-status/${userId}`, { status, reason });
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi đổi trạng thái user');
  return data;
}

// --- SESSION MANAGEMENT API ---
export async function logoutCurrentSession() {
  const res = await apiRequest("POST", `${BASE_BACKEND_URL}/api/session/logout`);
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi đăng xuất');
  return data;
}

export async function logoutAllSessions(reason: string) {
  const res = await apiRequest("POST", `${BASE_BACKEND_URL}/api/session/logout-all`, { reason });
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi đăng xuất tất cả');
  return data;
}

export async function forceLogoutUser(userId: number, reason: string) {
  const res = await apiRequest("POST", `${BASE_BACKEND_URL}/api/session/force-logout/${userId}`, { reason });
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi force logout user');
  return data;
}

export async function getActiveSessionCount() {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/session/active-count`);
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy số phiên hoạt động');
  return data.data;
}
// Base backend url constant
export const BASE_BACKEND_URL = "http://localhost:8080";

// --- ROLE API ---
export async function fetchRoles() {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/roles`);
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy danh sách role');
  return data.data;
}

export async function createRole(payload: { name: string; permissions: string[] }) {
  const res = await apiRequest("POST", `${BASE_BACKEND_URL}/api/admin/roles`, payload);
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi tạo role');
  return data;
}

export async function updateRole(id: number, payload: { name: string; permissions: string[] }) {
  const res = await apiRequest("PUT", `${BASE_BACKEND_URL}/api/admin/roles/${id}`, payload);
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi cập nhật role');
  return data;
}

export async function deleteRole(id: number, reason: string) {
  const res = await apiRequest("DELETE", `${BASE_BACKEND_URL}/api/admin/roles/${id}`, { reason });
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi xóa role');
  return data;
}

export async function updateRolePermissions(id: number, permissions: string[]) {
  const res = await apiRequest("PUT", `${BASE_BACKEND_URL}/api/admin/roles/${id}/permissions`, { permissions });
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi cập nhật quyền cho role');
  return data;
}

// --- PERMISSION API ---
export async function fetchPermissions() {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/permissions`);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy danh sách quyền');
  return data.data;
}

export async function updatePermission(id: number, payload: { name: string; reason: string }) {
  const res = await apiRequest("PUT", `${BASE_BACKEND_URL}/api/admin/permissions/${id}`, payload);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi cập nhật quyền');
  return data.data;
}

// Lấy danh sách user (có phân trang, luôn gửi Authorization header)
export async function fetchUsers(page = 0, size = 20) {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/users?page=${page}&size=${size}`);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy danh sách user');
  return data.data;
}
import { apiRequest } from "./queryClient";
import type { ApiResponse, User, Role, Permission, AuthResponse } from "../types/api";

const API_BASE = "http://localhost:8080/api";

export const authApi = {
  login: async (credentials: { username: string; password: string }): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiRequest("POST", `${API_BASE}/login`, credentials);
    return response.json();
  },
  register: async (userData: any): Promise<ApiResponse<User>> => {
    const response = await apiRequest("POST", `${API_BASE}/register`, userData);
    return response.json();
  },
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiRequest("POST", `${API_BASE}/refresh-token`, { refreshToken });
    return response.json();
  },
};

export const usersApi = {
  getAll: async (page = 0, size = 20): Promise<ApiResponse<{ content: User[]; page: any }>> => {
    const response = await apiRequest("GET", `${API_BASE}/admin/users?page=${page}&size=${size}`);
    return response.json();
  },
};

export const rolesApi = {
  getAll: async (): Promise<ApiResponse<Role[]>> => {
    const response = await apiRequest("GET", `${API_BASE}/admin/roles`);
    return response.json();
  },
  create: async (roleData: { name: string; permissions?: string[] }): Promise<ApiResponse<Role>> => {
    const response = await apiRequest("POST", `${API_BASE}/admin/roles`, roleData);
    return response.json();
  },
  update: async (id: number, roleData: { name: string; permissions?: string[] }): Promise<ApiResponse<Role>> => {
    const response = await apiRequest("PUT", `${API_BASE}/admin/roles/${id}`, roleData);
    return response.json();
  },
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiRequest("DELETE", `${API_BASE}/admin/roles/${id}`, { reason: "Admin deletion" });
    return response.json();
  },
};

export const permissionsApi = {
  getAll: async (): Promise<ApiResponse<Permission[]>> => {
    const response = await apiRequest("GET", `${API_BASE}/admin/permissions`);
    return response.json();
  },
  update: async (id: number, data: { name: string; reason: string }): Promise<ApiResponse<Permission>> => {
    const response = await apiRequest("PUT", `${API_BASE}/admin/permissions/${id}`, data);
    return response.json();
  },
};
