// src/lib/apis/authRefresh.ts
import { API_BASE } from "./base";

export async function refreshTokenApi(refreshToken: string) {
  const res = await fetch(`${API_BASE}/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error("Failed to refresh token");
  const data = await res.json();
  return data.data;
}
