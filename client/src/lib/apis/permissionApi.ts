import { apiRequest } from "../queryClient";
import { BASE_BACKEND_URL } from "./base.ts";
import type { ApiResponse, Permission } from "../../types/api";

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
