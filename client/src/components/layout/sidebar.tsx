
import React from "react";
import { useAuth } from "../../hooks/use-auth";
import { Link } from "wouter";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  DashboardOutlined,
  BankOutlined,
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
    ...(isAdmin ? [{
      key: "/branches",
      icon: <BankOutlined />,
      label: <Link href="/branches">Chi nhánh</Link>,
    }] : []),
  ];
  return (
    <>
      <Sider width={220} style={{ minHeight: "100vh", background: "#fff" }} className="custom-sidebar">
        <Menu
          mode="inline"
          defaultSelectedKeys={[window.location.pathname]}
          style={{ height: "100%", borderRight: 0 }}
          items={items}
        />
      </Sider>
      <style>{`
        @media (max-width: 600px) {
          .custom-sidebar {
            width: 60px !important;
            min-width: 60px !important;
            max-width: 60px !important;
          }
          .custom-sidebar .ant-menu {
            font-size: 14px !important;
          }
          .custom-sidebar .ant-menu-item {
            padding-left: 12px !important;
            padding-right: 8px !important;
          }
          .custom-sidebar .ant-menu-item .anticon {
            font-size: 18px !important;
          }
          .custom-sidebar .ant-menu-item a {
            font-size: 0 !important;
          }
          .custom-sidebar .ant-menu-item-selected {
            background: #e6f7ff !important;
          }
        }
      `}</style>
    </>
  );
}
