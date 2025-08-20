import React from "react";
import { Layout, Avatar, Dropdown, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useLocation } from "wouter";
const logo = "/logo/ChatGPT Image Aug 20, 2025, 04_06_17 PM.png";

const { Header } = Layout;

export const AdminHeader: React.FC<{ username?: string }> = ({ username }) => {
  const [, setLocation] = useLocation();


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
          setLocation("/login");
        },
      },
    ]
  };

  return (
    <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#141414", padding: "0 24px", height: 64 }}>
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => setLocation("/dashboard") }>
        <img src={logo} alt="Logo" style={{ height: 40, marginRight: 16 }} />
        <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>Demo Login</Typography.Title>
      </div>
      <Dropdown menu={menu} placement="bottomRight">
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <span style={{ color: "#fff", fontWeight: 500 }}>{username || "Admin"}</span>
        </div>
      </Dropdown>
    </Header>
  );
};
