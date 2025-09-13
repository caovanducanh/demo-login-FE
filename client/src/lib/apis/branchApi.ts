import { apiRequest } from "../queryClient";
import { BASE_BACKEND_URL, API_BASE } from "./base";
import type { Branch, BranchSelectRequest, EmailValidationRequest } from "../../types/branch";

/**
 * Get all available branches for user selection
 */
export async function getBranches(): Promise<Branch[]> {
  const response = await apiRequest("GET", `${API_BASE}/branches`);
  return response.json();
}

/**
 * Select a branch for OAuth2 authentication
 */
export async function selectBranch(branchCode: string): Promise<Branch> {
  const response = await apiRequest("POST", `${API_BASE}/branches/select?branchCode=${branchCode}`);
  return response.json();
}

/**
 * Validate if an email is allowed for a specific branch
 */
export async function validateEmailForBranch(email: string, branchCode: string): Promise<boolean> {
  const response = await apiRequest("GET", `${API_BASE}/branches/validate-email?email=${encodeURIComponent(email)}&branchCode=${branchCode}`);
  return response.json();
}

/**
 * Get OAuth2 URL with branch parameter
 */
export async function getOAuth2Url(branchCode: string): Promise<string> {
  const response = await apiRequest("GET", `${API_BASE}/branches/oauth2-url?branchCode=${branchCode}`);
  return response.json();
}

/**
 * Initiate Google OAuth2 login with selected branch
 */
export function initiateGoogleLogin(branchCode: string): void {
  window.location.href = `${BASE_BACKEND_URL}/oauth2/authorization/google?branch=${branchCode}`;
}

/**
 * Admin functions for managing allowed emails
 */

export async function addAllowedEmail(branchId: number, email: string, description?: string): Promise<void> {
  const url = `${API_BASE}/branches/${branchId}/allowed-emails?email=${encodeURIComponent(email)}${description ? `&description=${encodeURIComponent(description)}` : ''}`;
  await apiRequest("POST", url);
}

export async function removeAllowedEmail(branchId: number, email: string): Promise<void> {
  const url = `${API_BASE}/branches/${branchId}/allowed-emails?email=${encodeURIComponent(email)}`;
  await apiRequest("DELETE", url);
}

export async function getAllowedEmails(branchId: number): Promise<string[]> {
  const response = await apiRequest("GET", `${API_BASE}/branches/${branchId}/allowed-emails`);
  return response.json();
}
