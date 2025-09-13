// Branch types for branch-aware authentication
export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  allowedEmails: string[];
  active: boolean;
  createdAt: string;
}

export interface BranchSelectRequest {
  branchCode: string;
}

export interface EmailValidationRequest {
  email: string;
  branchCode: string;
}

export interface OAuth2UrlResponse {
  url: string;
}
