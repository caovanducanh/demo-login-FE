import React, { useMemo, useEffect, useState } from "react";
import { Layout, Avatar, Dropdown, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useLocation } from "wouter";
import { decode as jwtDecode } from "../../service/jwt";
import { useAuth } from "../../hooks/use-auth";

const { Header } = Layout;

interface JwtPayload {
  sub: string;
  roles: string[];
  fullName?: string;
}

const AppHeader: React.FC = () => {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const token = localStorage.getItem("token") || undefined;

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token) as JwtPayload;
    } catch {
      return null;
    }
  }, [token]);

  const roles: string[] = user?.roles || [];
  const isAdmin = roles.includes("ADMIN");

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
        onClick: logout,
      },
    ],
  };

  const handleLogoClick = () => {
    setLocation(isAdmin ? "/dashboard" : "/home");
  };

  const logoUrl =
    "https://raw.githubusercontent.com/caovanducanh/demo-login-FE/master/logo.png";

  return (
    <Header
      style={{
        background: "#141414",
        padding: "0 24px",
        minHeight: 64,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        className="header-inner"
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="header-logo-title"
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            minWidth: 0,
            flexGrow: 1,
          }}
          onClick={handleLogoClick}
        >
          <img
            src={logoUrl}
            alt="Logo"
            className="header-logo"
            style={{
              height: 40,
              marginRight: 16,
              flexShrink: 0,
              transition: "height 0.2s",
            }}
            onError={(e) => {
              console.error("Logo failed to load from GitHub");
              e.currentTarget.style.display = "none";
            }}
          />
          <Typography.Title
            level={4}
            className="header-title"
            style={{
              color: "#fff",
              margin: 0,
              fontSize: 22,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 200,
              flexGrow: 1,
              transition: "font-size 0.2s, max-width 0.2s",
            }}
          >
            Demo Login
          </Typography.Title>
        </div>
        <div
          className="header-user"
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 0,
            marginBottom: 0,
            justifyContent: "flex-end",
            flex: 1,
            minWidth: 0,
          }}
        >
          {user ? (
            <Dropdown menu={menu} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  minWidth: 0,
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  className="header-avatar"
                  style={{
                    marginRight: 8,
                    transition: "width 0.2s, height 0.2s",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="header-username"
                  style={{
                    color: "#fff",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 160,
                  }}
                >
                  {user.fullName || user.sub}
                </span>
              </div>
            </Dropdown>
          ) : (
            <button
              className="header-login-btn"
              style={{
                background: "transparent",
                color: "#fff",
                border: "none",
                borderRadius: 0,
                padding: "6px 18px",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: 16,
              }}
              onClick={() => setLocation("/login")}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Responsive style */}
      <style>{`
        @media (max-width: 600px) {
          .ant-layout-header {
            padding: 0 8px !important;
            min-height: 56px !important;
          }
          .header-logo {
            height: 28px !important;
            margin-right: 8px !important;
          }
          .header-title {
            font-size: 15px !important;
            max-width: 140px !important;
          }
          .header-avatar {
            width: 28px !important;
            height: 28px !important;
            margin-right: 6px !important;
          }
          .header-username {
            font-size: 14px !important;
            max-width: 120px !important;
          }
          .header-login-btn {
            font-size: 14px !important;
            padding: 4px 10px !important;
          }
        }
        @media (max-width: 400px) {
          .header-username {
            display: none !important;
          }
          .header-title {
            max-width: 160px !important;
          }
        }
      `}</style>
    </Header>
  );
};

export default AppHeader;
