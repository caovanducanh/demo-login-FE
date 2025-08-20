
import React from "react";
import { useAuth } from "../../hooks/use-auth";
import { Link } from "wouter";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  DashboardOutlined,
  IdcardOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

export function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("ADMIN");
  const items = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link href="/users">Users</Link>,
    },
    ...(isAdmin ? [{
      key: "/roles",
      icon: <TeamOutlined />,
      label: <Link href="/roles">Roles</Link>,
    }] : []),
    {
      key: "/permissions",
      icon: <SafetyOutlined />,
      label: <Link href="/permissions">Permissions</Link>,
    },
  ];
  return (
    <Sider width={220} style={{ minHeight: "100vh", background: "#fff" }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={[window.location.pathname]}
        style={{ height: "100%", borderRight: 0 }}
        items={items}
      />
    </Sider>
  );
}
