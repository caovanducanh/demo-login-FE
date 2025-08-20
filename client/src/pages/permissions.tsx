
import React, { useState } from "react";
import { Table, Typography, message, Input, Button, Form, Modal } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as permissionApi from "../lib/apis/permissionApi";


export default function Permissions() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery(["permissions"], permissionApi.fetchPermissions);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const updateMutation = useMutation(({ id, values }: any) => permissionApi.updatePermission(id, values), {
    onSuccess: () => {
      message.success("Permission updated");
      setEditing(null);
      queryClient.invalidateQueries(["permissions"]);
    },
    onError: (err: any) => message.error(err.message)
  });

  const handleEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue({ name: record.name });
  };
  const handleSave = () => {
    form.validateFields().then(values => {
      updateMutation.mutate({ id: editing.id, values: { name: values.name, reason: "Update permission name" } });
    });
  };
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button size="small" onClick={() => handleEdit(record)}>Edit</Button>
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
      <Typography.Title level={2} style={{ marginBottom: 16 }}>Permission Management</Typography.Title>
      <Table
        columns={columns}
        dataSource={data || []}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
      <Modal
        open={!!editing}
        title="Edit Permission"
        onOk={handleSave}
        onCancel={() => setEditing(null)}
        confirmLoading={updateMutation.isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Permission Name" rules={[{ required: true, message: "Permission name is required" }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
