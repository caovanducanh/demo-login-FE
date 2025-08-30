import axios from "axios";

export async function verifyHuman(token: string) {
  // Gửi token Turnstile lên backend để xác thực
  const res = await axios.post("/api/verify-human-token", { token });
  // Kết quả trả về: { success: boolean, message: string }
  if (!res.data?.success) {
    const err = new Error(res.data?.message || "Xác minh thất bại");
    // Gắn thêm response để App.tsx có thể lấy message
    (err as any).response = { data: res.data };
    throw err;
  }
  return res.data;
}
