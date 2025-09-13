import React, { useState } from "react";
import { Card, Typography, Table, Button, Modal, Form, Input, message, Popconfirm, Tag, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useBranch } from "../../hooks/use-branch";
import type { Branch } from "../../types/branch";

const { Title, Text } = Typography;

const BranchManagement: React.FC = () => {
  const { branches, isLoading, addAllowedEmail, removeAllowedEmail, getAllowedEmails } = useBranch();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const allowedEmailsQuery = selectedBranch ? getAllowedEmails(selectedBranch.id) : null;

  const handleAddEmail = async (values: { email: string; description?: string }) => {
    if (!selectedBranch) return;
    
    try {
      await addAllowedEmail({
        branchId: selectedBranch.id,
        email: values.email,
        description: values.description,
      });
      setIsModalVisible(false);
      form.resetFields();
      // Refresh allowed emails
      if (allowedEmailsQuery) {
        allowedEmailsQuery.refetch();
      }
    } catch (error) {
      console.error("Error adding email:", error);
    }
  };

  const handleRemoveEmail = async (email: string) => {
    if (!selectedBranch) return;
    
    try {
      await removeAllowedEmail({
        branchId: selectedBranch.id,
        email,
      });
      // Refresh allowed emails
      if (allowedEmailsQuery) {
        allowedEmailsQuery.refetch();
      }
    } catch (error) {
      console.error("Error removing email:", error);
    }
  };

  const branchColumns = [
    {
      title: "Chi nhánh",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Branch) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <Text type="secondary" style={{ fontSize: "0.85rem" }}>
            {record.code} - {record.address}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "Hoạt động" : "Tạm dừng"}</Tag>
      ),
    },
    {
      title: "Số email được phép",
      dataIndex: "allowedEmails",
      key: "allowedEmails",
      render: (emails: string[]) => emails.length,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Branch) => (
        <Button
          type="primary"
          size="small"
          onClick={() => setSelectedBranch(record)}
        >
          Quản lý email
        </Button>
      ),
    },
  ];

  const emailColumns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: { email: string }) => (
        <Popconfirm
          title="Xóa email"
          description="Bạn có chắc chắn muốn xóa email này khỏi danh sách được phép?"
          onConfirm={() => handleRemoveEmail(record.email)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger size="small" icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <Title level={2}>Quản lý chi nhánh và email</Title>
      
      <Card title="Danh sách chi nhánh" style={{ marginBottom: "2rem" }}>
        <Table
          columns={branchColumns}
          dataSource={branches}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {selectedBranch && (
        <Card
          title={`Quản lý email cho ${selectedBranch.name}`}
          extra={
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Thêm email
              </Button>
              <Button onClick={() => setSelectedBranch(null)}>Đóng</Button>
            </Space>
          }
        >
          <Table
            columns={emailColumns}
            dataSource={
              allowedEmailsQuery?.data?.map((email) => ({ email })) || []
            }
            rowKey="email"
            loading={allowedEmailsQuery?.isLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

      <Modal
        title="Thêm email được phép"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddEmail}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="example@fpt.edu.vn" />
          </Form.Item>
          
          <Form.Item name="description" label="Mô tả (tùy chọn)">
            <Input placeholder="Ví dụ: Sinh viên khoa CNTT" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BranchManagement;
