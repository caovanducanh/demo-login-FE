import { apiRequest } from "../queryClient";
import { BASE_BACKEND_URL } from "./base";

export async function logoutCurrentSession() {
  const res = await apiRequest("POST", `${BASE_BACKEND_URL}/api/session/logout`);
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) throw new Error(data.message || 'Lỗi đăng xuất');
  return data;
}

export async function logoutAllSessions() {
  const res = await apiRequest("POST", `${BASE_BACKEND_URL}/api/session/logout-all`);
  const data = await res.json();
  if (data.status !== 200 && data.statusCode !== 200) {
    throw new Error(data.message || "Lỗi đăng xuất tất cả");
  }
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
