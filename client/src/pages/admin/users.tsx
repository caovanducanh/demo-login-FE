import React from "react";
import { Table, Button, Space, Tag, message, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../lib/apis/userApi";

export default function Users() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, error } = useQuery(
    ["users", page],
    () => fetchUsers(page - 1, 20),
    { keepPreviousData: true }
  );

  React.useEffect(() => {
    if (isError && error instanceof Error) {
      message.error(error.message);
    }
  }, [isError, error]);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: string[] = []) => (
        <>
          {roles.length === 0 ? (
            <Tag color="default">No Role</Tag>
          ) : (
            roles.map((role) => (
              <Tag key={role} color={role === "ADMIN" ? "volcano" : "blue"}>{role}</Tag>
            ))
          )}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status === "LOCKED" ? (
          <Tag color="red">Locked</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" size="small">
            Edit
          </Button>
          {record.status === "LOCKED" ? (
            <Button size="small">Unlock</Button>
          ) : (
            <Button danger size="small">
              Lock
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2} style={{ marginBottom: 16 }}>
        User Management
      </Typography.Title>
      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={data?.data?.content || []}
          rowKey="userId"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: 20,
            total: data?.data?.page?.totalElements || 0,
            onChange: (p) => setPage(p),
          }}
          scroll={{ x: "max-content" }}
        />
      </div>
      <style>{`
        @media (max-width: 600px) {
          .ant-table {
            font-size: 13px;
          }
          .ant-btn {
            font-size: 13px;
            padding: 0 8px;
            height: 28px;
          }
          h2, .ant-typography {
            font-size: 18px !important;
          }
          .ant-modal {
            width: 98vw !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
