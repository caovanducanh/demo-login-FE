import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

export async function verifyHuman(token: string) {
  // Gửi token Turnstile lên backend để xác thực
  const res = await axios.post(`${BASE_URL}/api/verify-human`, { token });
  // Kết quả trả về: { verifyToken: string | null }
  return res.data;
}
