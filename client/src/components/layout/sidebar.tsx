
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
  return (
    <Sider width={220} style={{ minHeight: "100vh", background: "#fff" }}>
      <Menu mode="inline" defaultSelectedKeys={[window.location.pathname]} style={{ height: "100%", borderRight: 0 }}>
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link href="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/users" icon={<UserOutlined />}>
          <Link href="/users">Users</Link>
        </Menu.Item>
        {isAdmin && (
          <Menu.Item key="/roles" icon={<TeamOutlined />}>
            <Link href="/roles">Roles</Link>
          </Menu.Item>
        )}
        <Menu.Item key="/permissions" icon={<SafetyOutlined />}>
          <Link href="/permissions">Permissions</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
