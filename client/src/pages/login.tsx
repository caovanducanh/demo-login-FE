import React, { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useLocation } from "wouter";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (login.isSuccess && login.data?.data?.token) {
      message.success("Đăng nhập thành công!");
      setTimeout(() => setLocation("/dashboard"), 500);
    } else if (login.isError && login.error instanceof Error) {
      message.error(login.error.message);
    }
  }, [login.isSuccess, login.isError]);

  const onFinish = (values: any) => {
    setLoading(true);
    login.mutate({ username: values.username, password: values.password }, {
      onSettled: () => setLoading(false)
    });
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <Card>
        <Typography.Title level={3} style={{ textAlign: "center" }}>Đăng nhập</Typography.Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập username!" }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
