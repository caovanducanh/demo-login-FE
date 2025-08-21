
import React, { useState } from "react";
import { Table, Typography, message, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as roleApi from "../../lib/apis/roleApi";
import * as permissionApi from "../../lib/apis/permissionApi";


export default function Roles() {
  const queryClient = useQueryClient();
  const { data: roles, isLoading, isError, error } = useQuery(["roles"], roleApi.fetchRoles);
  const { data: permissions } = useQuery(["permissions"], permissionApi.fetchPermissions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [form] = Form.useForm();

  const createMutation = useMutation(roleApi.createRole, {
    onSuccess: () => {
      message.success("Role created");
      setModalOpen(false);
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (err: any) => {
      // Chỉ lấy phần message phía sau mã lỗi nếu có dạng '400: ...'
      // Chỉ lấy phần message phía sau mã lỗi nếu có dạng '400: ...', hoặc lấy toàn bộ nếu không có
      let msg = err.message;
      // Nếu có dạng '400: ...', chỉ lấy phần sau dấu ':'
      const match = msg.match(/^\d{3}:\s*(.*)$/);
      if (match) msg = match[1];
      message.error({
        content: msg,
        style: { fontSize: 18, minWidth: 400 },
        duration: 3,
      });
    }
  });
  const updateMutation = useMutation(({ id, data }: any) => roleApi.updateRole(id, data), {
    onSuccess: () => {
      message.success("Role updated");
      setModalOpen(false);
      setEditingRole(null);
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (err: any) => message.error(err.message)
  });
  const deleteMutation = useMutation((id: number) => roleApi.deleteRole(id), {
    onSuccess: () => {
      message.success("Role deleted");
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (err: any) => message.error(err.message)
  });

  const handleEdit = async (role: any) => {
    setEditingRole(role);
    try {
      const detail = await roleApi.getRoleDetail(role.id);
      form.setFieldsValue({
        name: detail.name,
        permissions: detail.permissions ? detail.permissions.map((p: any) => p.code) : [],
      });
      setModalOpen(true);
    } catch (err: any) {
      message.error(err.message || 'Lỗi lấy thông tin role');
    }
  };
  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalOpen(true);
  };
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingRole) {
        updateMutation.mutate({ id: editingRole.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [roleDetail, setRoleDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleDetail = async (role: any) => {
    setLoadingDetail(true);
    try {
      const detail = await roleApi.getRoleDetail(role.id);
      setRoleDetail(detail);
      setDetailModalOpen(true);
    } catch (err: any) {
      message.error(err.message || 'Lỗi lấy chi tiết role');
    } finally {
      setLoadingDetail(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: "10%", align: "center" as const },
    { title: "Name", dataIndex: "name", key: "name", width: "45%", align: "center" as const },
    {
      title: "Actions",
      key: "actions",
      width: '45%',
      align: "right" as const,
      render: (_: any, record: any) => (
        <div className="action-btn-group">
          <Button key="detail" size="small" onClick={() => handleDetail(record)} style={{ marginRight: 8 }}>Detail</Button>
          <Button key="edit" size="small" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Popconfirm key="delete" title="Delete this role?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  React.useEffect(() => {
    if (isError && error instanceof Error) {
      message.error(error.message);
    }
  }, [isError, error]);

  return (
    <div>
      <Typography.Title level={2} style={{ marginBottom: 16 }}>Role Management</Typography.Title>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Add Role</Button>
      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={roles || []}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          scroll={{ x: 'max-content' }}
          style={{ tableLayout: 'fixed', minWidth: 400 }}
        />
      </div>
      <Modal
        open={modalOpen}
        title={editingRole ? "Edit Role" : "Add Role"}
        onOk={handleOk}
        onCancel={() => { setModalOpen(false); setEditingRole(null); }}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
        bodyStyle={{ padding: 12 }}
        style={{ maxWidth: '95vw', minWidth: 0 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: "Role name is required" }]}> <Input /> </Form.Item>
          <Form.Item name="permissions" label="Permissions">
            <Select mode="multiple" allowClear placeholder="Select permissions">
              {(permissions || []).map((p: any) => (
                <Select.Option key={p.code} value={p.code}>{p.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={detailModalOpen}
        title={roleDetail ? `Role Detail: ${roleDetail.name}` : 'Role Detail'}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={500}
        confirmLoading={loadingDetail}
        bodyStyle={{ padding: 12 }}
        style={{ maxWidth: '95vw', minWidth: 0 }}
      >
        {roleDetail ? (
          <div>
            <p><b>ID:</b> {roleDetail.id}</p>
            <p><b>Name:</b> {roleDetail.name}</p>
            <p><b>Permissions:</b></p>
            <ul>
              {roleDetail.permissions && roleDetail.permissions.length > 0 ? (
                roleDetail.permissions.map((perm: any) => (
                  <li key={perm.id}><b>{perm.code}</b>: {perm.name}</li>
                ))
              ) : (
                <li>No permissions</li>
              )}
            </ul>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
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
          .action-btn-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }
          .ant-table-cell {
            text-align: center !important;
          }
        }
        .action-btn-group {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
