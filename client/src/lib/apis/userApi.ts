import { apiRequest } from "../queryClient";
import { BASE_BACKEND_URL } from "./base.ts";
import type { ApiResponse, User } from "../../types/api";

export async function fetchCurrentUser() {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/users/me`);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy thông tin user');
  return data.data;
}

export async function fetchUsers(page = 0, size = 20) {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/users?page=${page}&size=${size}`);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy danh sách user');
  return data.data;
}
