import React from "react";
import { Table, Button, message, Typography, Modal, Select } from "antd";
import { fetchUsers } from "../lib/apis/userApi";
import { lockAccount, unlockAccount, changeUserStatus } from "../lib/apis/securityApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const statusOptions = [
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
  { label: "LOCKED", value: "LOCKED" },
];

export default function Security() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["users-security"], () => fetchUsers(0, 100));
  const lockMutation = useMutation(({ userId, reason }: any) => lockAccount(userId, reason), {
    onSuccess: () => {
      message.success("Khóa tài khoản thành công");
      queryClient.invalidateQueries(["users-security"]);
    },
    onError: (e: any) => message.error(e.message),
  });
  const unlockMutation = useMutation((userId: number) => unlockAccount(userId), {
    onSuccess: () => {
      message.success("Mở khóa tài khoản thành công");
      queryClient.invalidateQueries(["users-security"]);
    },
    onError: (e: any) => message.error(e.message),
  });
  const statusMutation = useMutation(({ userId, status, reason }: any) => changeUserStatus(userId, status, reason), {
    onSuccess: () => {
      message.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries(["users-security"]);
    },
    onError: (e: any) => message.error(e.message),
  });

  const handleLock = (userId: number) => {
    Modal.confirm({
      title: "Lý do khóa tài khoản",
      content: (
        <input id="lock-reason" style={{ width: "100%" }} placeholder="Nhập lý do" />
      ),
      onOk: () => {
        const reason = (document.getElementById("lock-reason") as HTMLInputElement)?.value || "";
        lockMutation.mutate({ userId, reason });
      },
    });
  };
  const handleUnlock = (userId: number) => unlockMutation.mutate(userId);
  const handleChangeStatus = (userId: number) => {
    let status = "ACTIVE";
    let reason = "";
    Modal.confirm({
      title: "Cập nhật trạng thái",
      content: (
        <div>
          <Select defaultValue="ACTIVE" style={{ width: "100%", marginBottom: 8 }}
            options={statusOptions} onChange={v => (status = v)} />
          <input id="status-reason" style={{ width: "100%" }} placeholder="Lý do" onChange={e => (reason = e.target.value)} />
        </div>
      ),
      onOk: () => statusMutation.mutate({ userId, status, reason }),
    });
  };

  const columns = [
    { title: "ID", dataIndex: "userId", key: "userId" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          {record.status === "LOCKED" ? (
            <Button size="small" onClick={() => handleUnlock(record.userId)}>Mở khóa</Button>
          ) : (
            <Button size="small" danger onClick={() => handleLock(record.userId)}>Khóa</Button>
          )}
          <Button size="small" style={{ marginLeft: 8 }} onClick={() => handleChangeStatus(record.userId)}>Đổi trạng thái</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2} style={{ marginBottom: 16 }}>Security Management</Typography.Title>
      <Table
        columns={columns}
        dataSource={data?.content || []}
        rowKey="userId"
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
}
