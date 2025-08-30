import axios from "axios";

export async function verifyHuman(token: string) {
  // Gửi token Turnstile lên backend để xác thực
  const res = await axios.post("/api/human-verify", { token });
  return res.data;
}
