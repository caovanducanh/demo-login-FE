// Định nghĩa type cho Role API
export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface RoleListResponse {
  data: Role[];
  total: number;
}
