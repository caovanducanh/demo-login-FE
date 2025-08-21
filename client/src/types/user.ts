// Định nghĩa type cho User API

export interface UserInfo {
  userId: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  status?: string;
  role?: string;
  identity_Card?: string;
}

export interface UserListResponse {
  data: {
    content: UserInfo[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  };
}
