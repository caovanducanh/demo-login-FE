import React, { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { loginWithGoogle } from "../lib/apis/authApi";
import { useLocation } from "wouter";
import { decode as jwtDecode } from "../service/jwt";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      try {
        const payload = jwtDecode(token) as { roles: string[]; sub: string };
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: payload.sub,
            roles: payload.roles,
          })
        );
        if (payload.roles && payload.roles.includes("ADMIN")) {
          setLocation("/dashboard");
        } else {
          setLocation("/home");
        }
      } catch {
        setLocation("/dashboard");
      }
    }
  }, [setLocation]);

  React.useEffect(() => {
    if (login.isSuccess && login.data?.token) {
      try {
        const payload = jwtDecode(login.data.token) as {
          roles: string[];
          sub: string;
        };
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: payload.sub,
            roles: payload.roles,
          })
        );
        if (payload.roles && payload.roles.includes("ADMIN")) {
          setLocation("/dashboard");
        } else {
          setLocation("/home");
        }
      } catch {
        setLocation("/dashboard");
      }
    } else if (login.isError && login.error instanceof Error) {
      message.error(login.error.message);
    }
  }, [login.isSuccess, login.isError]);

  const onFinish = (values: any) => {
    setLoading(true);
    login.mutate(
      { username: values.username, password: values.password },
      {
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f2f5 0%, #d6e4ff 100%)",
        padding: 16,
      }}
    >
      <Card
        style={{
          width: 360,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          Đăng nhập
        </Typography.Title>

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
            <Input size="large" autoFocus placeholder="Nhập username..." />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập password!" }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Button
          type="default"
          block
          size="large"
          style={{
            marginTop: 8,
            background: "#fff",
            border: "1px solid #d9d9d9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          icon={
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{
                width: 18,
                marginRight: 8,
                verticalAlign: "middle",
              }}
            />
          }
          onClick={loginWithGoogle}
        >
          Đăng nhập với Google
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
