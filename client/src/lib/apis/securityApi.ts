import { apiRequest } from "../queryClient";
import { BASE_BACKEND_URL } from "./base.ts";

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
