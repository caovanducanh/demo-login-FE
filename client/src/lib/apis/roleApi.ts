import { apiRequest } from "../queryClient";
import { BASE_BACKEND_URL } from "./base.ts";
import type { ApiResponse, Role, Permission } from "../../types/api";

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

export async function getRoleDetail(id: number) {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/roles/${id}`);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy chi tiết role');
  return data.data;
}
