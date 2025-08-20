

import React from "react";
import { Table, Button, Space, Tag, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../lib/api";

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
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role: string) => <Tag color={role === "ADMIN" ? "volcano" : "blue"}>{role}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => status === "LOCKED" ? <Tag color="red">Locked</Tag> : <Tag color="green">Active</Tag>,
  },
  {
    title: "Actions",
    key: "actions",
    render: (_: any, record: any) => (
      <Space>
        <Button type="primary" size="small">Edit</Button>
        {record.status === "LOCKED" ? (
          <Button size="small">Unlock</Button>
        ) : (
          <Button danger size="small">Lock</Button>
        )}
      </Space>
    ),
  },
];

export default function Users() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, error, refetch } = useQuery([
    "users",
    page
  ], () => fetchUsers(page - 1, 20), { keepPreviousData: true });

  React.useEffect(() => {
    if (isError && error instanceof Error) {
      message.error(error.message);
    }
  }, [isError, error]);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>User Management</h2>
      <Table
        columns={columns}
        dataSource={data?.content || []}
        rowKey="userId"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 20,
          total: data?.page?.totalElements || 0,
          onChange: (p) => setPage(p),
        }}
      />
    </div>
  );
}
