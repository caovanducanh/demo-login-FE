import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, DatePicker, Select, message } from "antd";
import { useLocation } from "wouter";
import { register as registerApi, loginWithGoogle } from "../lib/apis/authApi";
import dayjs from "dayjs";

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format("YYYY-MM-DD") : undefined,
      };
      await registerApi(payload);
      message.success("Đăng ký thành công!");
      setLocation("/home");
    } catch (err: any) {
      if (err?.data) {
        // Hiển thị lỗi từng trường
        form.setFields(
          Object.entries(err.data).map(([name, msg]) => ({ name, errors: [msg as string] }))
        );
      } else {
        message.error(err?.message || "Đăng ký thất bại");
      }
    } finally {
      setLoading(false);
    }
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
          width: 400,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography.Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng ký
        </Typography.Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item name="username" label="Username" rules={[{ required: true, message: "Vui lòng nhập username!" }]}> <Input size="large" /> </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Vui lòng nhập password!" }, { min: 8, message: "Password phải tối thiểu 8 ký tự" }]}> <Input.Password size="large" /> </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const password = getFieldValue("password");
                  if (!value || password === value) {
                    return Promise.resolve();
                  }
                  // Chỉ báo lỗi nếu password đã hợp lệ (>=8 ký tự)
                  if (password && password.length >= 8) {
                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}> <Input size="large" /> </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}> <DatePicker size="large" style={{ width: "100%" }} format="YYYY-MM-DD" /> </Form.Item>
          <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}> <Select size="large" options={[{ value: "MALE", label: "Nam" }, { value: "FEMALE", label: "Nữ" }]} /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không hợp lệ!" }]}> <Input size="large" type="email" /> </Form.Item>
          <Form.Item name="identityCard" label="CMND/CCCD" rules={[{ required: true, message: "Vui lòng nhập số CMND/CCCD!" }]}> <Input size="large" /> </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^\d{8,15}$/, message: "Số điện thoại không hợp lệ!" }
          ]}> <Input size="large" /> </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}> <Input size="large" /> </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Đăng ký
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
              style={{ width: 18, marginRight: 8, verticalAlign: "middle" }}
            />
          }
          onClick={loginWithGoogle}
        >
          Đăng ký với Google
        </Button>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          Đã có tài khoản?{' '}
          <Button type="link" onClick={() => setLocation("/login")}>Đăng nhập</Button>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
