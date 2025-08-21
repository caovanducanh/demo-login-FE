import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCurrentUser } from "../../lib/apis/userApi";
import { logoutAllSessions } from "../../lib/apis/sessionApi";
import { Card, Typography, Descriptions, Spin, message, Tabs, Table, Button, Modal } from "antd";
import { fetchLoginHistory } from "../../lib/apis/loginHistoryApi";
import type { UserInfo } from "../../types/user";
import { useLocation } from "wouter";

const Profile: React.FC = () => {
  const [, setLocation] = useLocation();
  const { data, isLoading, isError, error } = useQuery<UserInfo>(["current-user"], fetchCurrentUser);
  const {
    data: loginHistory,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    error: errorHistory,
  } = useQuery(["login-history"], () => fetchLoginHistory(0, 20));

  const logoutAllMutation = useMutation(() => logoutAllSessions(), {
    onSettled: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setLocation("/login");
    },
  });

  React.useEffect(() => {
    if (isError && error instanceof Error) message.error(error.message);
  }, [isError, error]);

  React.useEffect(() => {
    if (isErrorHistory && errorHistory instanceof Error) message.error(errorHistory.message);
  }, [isErrorHistory, errorHistory]);

  if (isLoading) return <Spin style={{ margin: 32 }} />;
  if (!data) return null;

  const historyColumns = [
    { title: "Time", dataIndex: "timestamp", key: "timestamp", render: (v: string) => new Date(v).toLocaleString() },
    { title: "Activity Type", dataIndex: "activityType", key: "activityType" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "IP", dataIndex: "ipAddress", key: "ipAddress" },
    { title: "Device", dataIndex: "deviceInfo", key: "deviceInfo" },
    { title: "Details", dataIndex: "details", key: "details" },
  ];

  return (
    <Card
      style={{
        maxWidth: 700,
        margin: "32px auto",
        padding: "16px",
      }}
    >
      <Tabs
        defaultActiveKey="profile"
        items={[
          {
            key: "profile",
            label: <span>Profile</span>,
            children: (
              <>
                <Typography.Title
                  level={3}
                  style={{ fontSize: "1.5rem", textAlign: "center", marginBottom: 24 }}
                >
                  Profile
                </Typography.Title>
                <Descriptions
                  column={1}
                  bordered
                  size="middle"
                  labelStyle={{ width: "40%", wordWrap: "break-word" }}
                  contentStyle={{ wordWrap: "break-word" }}
                >
                  <Descriptions.Item label="Username">{data.username || ""}</Descriptions.Item>
                  <Descriptions.Item label="Full Name">{data.fullName || ""}</Descriptions.Item>
                  <Descriptions.Item label="Email">{(data as any).email || ""}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{(data as any).phone || ""}</Descriptions.Item>
                  <Descriptions.Item label="Address">{(data as any).address || ""}</Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">{(data as any).dateOfBirth || ""}</Descriptions.Item>
                  <Descriptions.Item label="Identity Card">{(data as any).identityCard || ""}</Descriptions.Item>
                  <Descriptions.Item label="Gender">{(data as any).gender || ""}</Descriptions.Item>
                  <Descriptions.Item label="Status">{(data as any).status || ""}</Descriptions.Item>
                  <Descriptions.Item label="Created Date">{(data as any).createdDate || ""}</Descriptions.Item>
                </Descriptions>
              </>
            ),
          },
          {
            key: "login-history",
            label: <span>Login History</span>,
            children: (
              <>
                <Typography.Title
                  level={4}
                  style={{ marginBottom: 16, fontSize: "1.2rem", textAlign: "center" }}
                >
                  Login History
                </Typography.Title>
                <div style={{ overflowX: "auto" }}>
                  <Table
                    dataSource={loginHistory?.content || []}
                    columns={historyColumns}
                    loading={isLoadingHistory}
                    rowKey={(record, idx) => (record && typeof record === 'object' && 'id' in record ? (record as any).id : idx)}
                    pagination={{
                      pageSize: loginHistory?.page?.size || 20,
                      total: loginHistory?.page?.totalElements || 0,
                      current: (loginHistory?.page?.number || 0) + 1,
                      showSizeChanger: false,
                    }}
                    style={{ marginBottom: 24, minWidth: 600 }}
                    size="small"
                  />
                </div>
                <Button
                  type="primary"
                  danger
                  style={{
                    marginTop: 16,
                    width: "100%",
                    maxWidth: 300,
                    fontWeight: 600,
                    fontSize: 16,
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  loading={logoutAllMutation.isLoading}
                  onClick={() => {
                    Modal.confirm({
                      title: "Logout all devices?",
                      content: "You will be logged out from all devices and must log in again.",
                      okText: "Logout all",
                      okButtonProps: { danger: true },
                      cancelText: "Cancel",
                      onOk: () => logoutAllMutation.mutate(),
                    });
                  }}
                >
                  Logout all devices
                </Button>
              </>
            ),
          },
        ]}
      />
      <style>{`
        @media (max-width: 600px) {
          .ant-card {
            margin: 16px !important;
            padding: 12px !important;
          }
          .ant-descriptions-item-label {
            font-size: 13px !important;
          }
          .ant-descriptions-item-content {
            font-size: 13px !important;
          }
          .ant-table {
            font-size: 12px !important;
          }
          .ant-btn {
            font-size: 14px !important;
            padding: 6px 12px !important;
          }
        }
      `}</style>
    </Card>
  );
};

export default Profile;
