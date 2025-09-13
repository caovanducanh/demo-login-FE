
import React, { useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { Typography, Card } from "antd";
import { useLocation } from "wouter";
import BranchSelector from "../components/BranchSelector";

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const { handleOAuth2Callback, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Handle OAuth2 callback when component mounts
  useEffect(() => {
    // Check if this is an OAuth2 callback
    const params = new URLSearchParams(window.location.search);
    if (params.has("token") || params.has("error")) {
      handleOAuth2Callback();
    }
  }, [handleOAuth2Callback]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/home");
    }
  }, [isAuthenticated, setLocation]);

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
          width: "100%",
          maxWidth: 600,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: "2rem" }}
      >
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Đăng nhập hệ thống
          </Title>
          <Typography.Text type="secondary">
            Chọn chi nhánh và đăng nhập bằng tài khoản Google
          </Typography.Text>
        </div>

        <BranchSelector />
      </Card>
    </div>
  );
};

export default LoginPage;
