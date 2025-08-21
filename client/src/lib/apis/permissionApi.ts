
import { apiRequest } from "../queryClient";
import { BASE_BACKEND_URL } from "./base";
import type { Permission } from "../../types/permission";


export async function fetchPermissions(): Promise<Permission[]> {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/permissions`);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy danh sách quyền');
  return data.data as Permission[];
}



export async function updatePermission(id: number, payload: { name: string }): Promise<Permission> {
  const res = await apiRequest("PUT", `${BASE_BACKEND_URL}/api/admin/permissions/${id}` , payload);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi cập nhật quyền');
  return data.data as Permission;
}
