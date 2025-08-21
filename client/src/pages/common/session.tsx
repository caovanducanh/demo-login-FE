import React from "react";
import { Card, Button, Typography, message } from "antd";
import { getActiveSessionCount, logoutCurrentSession, logoutAllSessions } from "../../lib/apis/sessionApi";
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
 const logoutAllMutation = useMutation(logoutAllSessions, {
  onSuccess: () => {
    message.success("Đăng xuất tất cả thành công");
    refetch();
  },
  onError: (e: any) => message.error(e.message),
});


  const handleLogoutAll = () => {
  logoutAllMutation.mutate();
};

  return (
    <Card style={{ maxWidth: 400, margin: "32px auto" }} className="session-card">
      <Typography.Title level={4}>Session Management</Typography.Title>
      <p>Số phiên hoạt động: <b>{isLoading ? "..." : data}</b></p>
      <div className="session-buttons">
        <Button
          type="primary"
          onClick={() => logoutMutation.mutate()}
          className="session-btn"
        >
          Đăng xuất thiết bị hiện tại
        </Button>
        <Button
          danger
          onClick={handleLogoutAll}
          className="session-btn"
        >
          Đăng xuất tất cả thiết bị
        </Button>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .session-card {
            max-width: 100% !important;
            margin: 16px;
          }
          .session-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .session-btn {
            width: 100%;
            font-size: 14px;
            height: 36px;
          }
          .ant-typography {
            font-size: 16px;
          }
          p {
            font-size: 14px;
          }
        }
      `}</style>
    </Card>
  );
}
