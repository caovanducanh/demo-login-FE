import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import * as branchApi from "../lib/apis/branchApi";
import type { Branch } from "../types/branch";
import { useToast } from "./use-toast";

export function useBranch() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Query to get all available branches
  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: branchApi.getBranches,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to select a branch
  const selectBranchMutation = useMutation({
    mutationFn: branchApi.selectBranch,
    onSuccess: (branch) => {
      setSelectedBranch(branch);
      toast({
        title: "Chi nhánh đã được chọn",
        description: `Đã chọn ${branch.name}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể chọn chi nhánh",
        variant: "destructive",
      });
    },
  });

  // Mutation to validate email for branch
  const validateEmailMutation = useMutation({
    mutationFn: ({ email, branchCode }: { email: string; branchCode: string }) =>
      branchApi.validateEmailForBranch(email, branchCode),
  });

  // Function to initiate Google login with selected branch
  const loginWithGoogle = (branchCode: string) => {
    if (!branchCode) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn chi nhánh trước khi đăng nhập",
        variant: "destructive",
      });
      return;
    }
    
    // Directly initiate Google login without calling select API
    branchApi.initiateGoogleLogin(branchCode);
  };

  // Admin functions
  const addAllowedEmailMutation = useMutation({
    mutationFn: ({ branchId, email, description }: { branchId: number; email: string; description?: string }) =>
      branchApi.addAllowedEmail(branchId, email, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast({
        title: "Thành công",
        description: "Đã thêm email được phép",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể thêm email",
        variant: "destructive",
      });
    },
  });

  const removeAllowedEmailMutation = useMutation({
    mutationFn: ({ branchId, email }: { branchId: number; email: string }) =>
      branchApi.removeAllowedEmail(branchId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast({
        title: "Thành công",
        description: "Đã xóa email khỏi danh sách được phép",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa email",
        variant: "destructive",
      });
    },
  });

  const allowedEmailsQuery = (branchId: number) =>
    useQuery({
      queryKey: ["allowedEmails", branchId],
      queryFn: () => branchApi.getAllowedEmails(branchId),
      enabled: !!branchId,
    });

  return {
    // Data
    branches: branchesQuery.data || [],
    selectedBranch,
    isLoading: branchesQuery.isLoading,
    error: branchesQuery.error,

    // Actions
    loginWithGoogle,
    validateEmail: validateEmailMutation.mutate,
    
    // Admin actions
    addAllowedEmail: addAllowedEmailMutation.mutate,
    removeAllowedEmail: removeAllowedEmailMutation.mutate,
    getAllowedEmails: allowedEmailsQuery,

    // States
    isValidatingEmail: validateEmailMutation.isPending,
    
    // Helper to set selected branch from stored data
    setSelectedBranch,
  };
}
