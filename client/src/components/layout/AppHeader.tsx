import React, { useMemo } from "react";
import { Layout, Avatar, Dropdown, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useLocation } from "wouter";
import { jwtDecode } from "jwt-decode";

// Sử dụng đường dẫn đơn giản đến logo mới (đã đổi tên)
const logo = "/logo/logo.png";
const { Header } = Layout;

interface JwtPayload {
  sub: string;
  roles: string[];
}

const AppHeader: React.FC = () => {
  const [, setLocation] = useLocation();
  const token = localStorage.getItem("token") || undefined;

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }, [token]);

  const roles: string[] = user?.roles || [];
  const isAdmin = roles.includes("ADMIN");
  const username = user?.sub || (isAdmin ? "Admin" : "Member");

  const menu = {
    items: [
      {
        key: "profile",
        label: "Profile",
        onClick: () => setLocation("/profile"),
      },
      {
        key: "logout",
        label: "Logout",
        onClick: () => {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setLocation("/login");
        },
      },
    ],
  };

  const handleLogoClick = () => {
    setLocation(isAdmin ? "/dashboard" : "/home");
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#141414",
        padding: "0 24px",
        height: 64,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={handleLogoClick}
      >
        <img 
          src={logo} 
          alt="Logo" 
          style={{ height: 40, marginRight: 16 }} 
          onError={(e) => {
            // Fallback nếu logo không tìm thấy
            console.error("Logo failed to load, check path:", logo);
            e.currentTarget.style.display = 'none';
          }}
        />
        <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
          Demo Login
        </Typography.Title>
      </div>
      <Dropdown menu={menu} placement="bottomRight">
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <span style={{ color: "#fff", fontWeight: 500 }}>{username}</span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;