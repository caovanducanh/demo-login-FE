import { apiRequest } from "../queryClient";
import { BASE_BACKEND_URL } from "./base";

export async function fetchLoginHistory(page = 0, size = 20) {
  const res = await apiRequest(
    "GET",
    `${BASE_BACKEND_URL}/api/user-activity-logs/my-login-history?page=${page}&size=${size}`
  );
  const data = await res.json();
  if (data.statusCode !== 200) throw new Error(data.message || "Lỗi lấy lịch sử đăng nhập");
  return data.data;
}
