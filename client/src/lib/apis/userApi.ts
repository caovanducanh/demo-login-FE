import { apiRequest } from "../queryClient";
import { BASE_BACKEND_URL } from "./base";
import type { UserInfo, UserListResponse } from "../../types/user";


export async function fetchCurrentUser(): Promise<UserInfo> {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/users/me`);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy thông tin user');
  return data.data as UserInfo;
}


export async function fetchUsers(page = 0, size = 20): Promise<UserListResponse> {
  const res = await apiRequest("GET", `${BASE_BACKEND_URL}/api/admin/users?page=${page}&size=${size}`);
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || 'Lỗi lấy danh sách user');
  return data as UserListResponse;
}
