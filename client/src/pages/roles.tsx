
import React, { useState } from "react";
import { Table, Typography, message, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi, permissionsApi } from "../lib/api";


export default function Roles() {
  const queryClient = useQueryClient();
  const { data: roles, isLoading, isError, error } = useQuery(["roles"], rolesApi.getAll);
  const { data: permissions } = useQuery(["permissions"], permissionsApi.getAll);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [form] = Form.useForm();

  const createMutation = useMutation(rolesApi.create, {
    onSuccess: () => {
      message.success("Role created");
      setModalOpen(false);
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (err: any) => message.error(err.message)
  });
  const updateMutation = useMutation(({ id, data }: any) => rolesApi.update(id, data), {
    onSuccess: () => {
      message.success("Role updated");
      setModalOpen(false);
      setEditingRole(null);
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (err: any) => message.error(err.message)
  });
  const deleteMutation = useMutation((id: number) => rolesApi.delete(id), {
    onSuccess: () => {
      message.success("Role deleted");
      queryClient.invalidateQueries(["roles"]);
    },
    onError: (err: any) => message.error(err.message)
  });

  const handleEdit = (role: any) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      permissions: role.permissions || [],
    });
    setModalOpen(true);
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
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button size="small" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Popconfirm title="Delete this role?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </>
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
      <Table
        columns={columns}
        dataSource={roles?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
      <Modal
        open={modalOpen}
        title={editingRole ? "Edit Role" : "Add Role"}
        onOk={handleOk}
        onCancel={() => { setModalOpen(false); setEditingRole(null); }}
        confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: "Role name is required" }]}> <Input /> </Form.Item>
          <Form.Item name="permissions" label="Permissions">
            <Select mode="multiple" allowClear placeholder="Select permissions">
              {(permissions?.data || []).map((p: any) => (
                <Select.Option key={p.code} value={p.code}>{p.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
