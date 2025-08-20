import React from "react";
import { Card, Button, Typography, message } from "antd";
import { getActiveSessionCount, logoutCurrentSession, logoutAllSessions } from "../lib/apis/sessionApi";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function Session() {
  const { data, isLoading, refetch } = useQuery(["active-session-count"], getActiveSessionCount);
  const logoutMutation = useMutation(logoutCurrentSession, {
    onSuccess: () => {
      message.success("Đăng xuất thành công");
      refetch();
    },
    onError: (e: any) => message.error(e.message),
  });
  const logoutAllMutation = useMutation((reason: string) => logoutAllSessions(reason), {
    onSuccess: () => {
      message.success("Đăng xuất tất cả thành công");
      refetch();
    },
    onError: (e: any) => message.error(e.message),
  });

  const handleLogoutAll = () => {
    let reason = "";
    // Simple prompt for reason
    reason = window.prompt("Lý do đăng xuất tất cả:", "") || "";
    if (reason) logoutAllMutation.mutate(reason);
  };

  return (
    <Card style={{ maxWidth: 400, margin: "32px auto" }}>
      <Typography.Title level={4}>Session Management</Typography.Title>
      <p>Số phiên hoạt động: <b>{isLoading ? "..." : data}</b></p>
      <Button type="primary" onClick={() => logoutMutation.mutate()} style={{ marginRight: 8 }}>Đăng xuất thiết bị hiện tại</Button>
      <Button danger onClick={handleLogoutAll}>Đăng xuất tất cả thiết bị</Button>
    </Card>
  );
}
