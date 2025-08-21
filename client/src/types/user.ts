// Định nghĩa type cho User API
export interface UserInfo {
  id: string;
  username: string;
  fullName: string;
  roles: string[];
}

export interface UserListResponse {
  data: UserInfo[];
  total: number;
}
