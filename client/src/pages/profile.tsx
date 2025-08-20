import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCurrentUser, logoutAllSessions } from "../lib/api";
import { Card, Typography, Descriptions, Spin, message, Tabs, Table, Button, Modal } from "antd";
import { fetchLoginHistory } from "../lib/loginHistoryApi";
import { useLocation } from "wouter";


const Profile: React.FC = () => {
  const [, setLocation] = useLocation();
  const { data, isLoading, isError, error } = useQuery(["current-user"], fetchCurrentUser);
  const {
    data: loginHistory,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    error: errorHistory,
    refetch: refetchHistory
  } = useQuery(["login-history"], () => fetchLoginHistory(0, 20));

  const logoutAllMutation = useMutation(() => logoutAllSessions("User logout all devices"), {
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setLocation("/login");
    },
    onError: (err: any) => {
      message.error(err.message);
    },
  });

  React.useEffect(() => {
    if (isError && error instanceof Error) {
      message.error(error.message);
    }
  }, [isError, error]);
  React.useEffect(() => {
    if (isErrorHistory && errorHistory instanceof Error) {
      message.error(errorHistory.message);
    }
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
    <Card style={{ maxWidth: 700, margin: "32px auto" }}>
      <Tabs defaultActiveKey="profile" items={[
        {
          key: "profile",
          label: <span>Profile</span>,
          children: (
            <>
              <Typography.Title level={3}>Profile</Typography.Title>
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item label="Username">{data.username}</Descriptions.Item>
                <Descriptions.Item label="Full Name">{data.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
                <Descriptions.Item label="Phone">{data.phone}</Descriptions.Item>
                <Descriptions.Item label="Address">{data.address}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">{data.dateOfBirth}</Descriptions.Item>
                <Descriptions.Item label="Identity Card">{data.identityCard}</Descriptions.Item>
                <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
                <Descriptions.Item label="Status">{data.status}</Descriptions.Item>
                <Descriptions.Item label="Created Date">{data.createdDate}</Descriptions.Item>
              </Descriptions>
            </>
          ),
        },
        {
          key: "login-history",
          label: <span>Login History</span>,
          children: (
            <>
              <Typography.Title level={4} style={{ marginBottom: 16 }}>Login History</Typography.Title>
              <Table
                dataSource={loginHistory?.content || []}
                columns={historyColumns}
                loading={isLoadingHistory}
                rowKey="id"
                pagination={{
                  pageSize: loginHistory?.page?.size || 20,
                  total: loginHistory?.page?.totalElements || 0,
                  current: (loginHistory?.page?.number || 0) + 1,
                  showSizeChanger: false,
                }}
                style={{ marginBottom: 24 }}
              />
              <Button
                type="primary"
                danger
                style={{
                  marginTop: 16,
                  width: 260,
                  fontWeight: 600,
                  fontSize: 16,
                  background: '#ff4d4f',
                  borderColor: '#ff4d4f',
                  color: '#fff',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
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
      ]} />
    </Card>
  );
};

export default Profile;
