// src/lib/apis/base.ts
const BASE_BACKEND_URL = import.meta.env.VITE_BASE_BACKEND_URL;
export { BASE_BACKEND_URL };
export const API_BASE = `${BASE_BACKEND_URL}/api`;
