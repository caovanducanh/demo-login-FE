import { Sidebar } from "./components/layout/sidebar";


import React from "react";
import { useAuth } from "./hooks/use-auth";
import { useLocation, Redirect } from "wouter";
import { Layout } from "antd";
import { AdminHeader } from "./components/layout/AdminHeader";
import { AppRoutes } from "./routes/AppRoutes";
import LoginPage from "./pages/login";


export default function App() {
  const [location] = useLocation();
  const token = localStorage.getItem("token");
  let username = "Admin";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.username) username = user.username;
  } catch {}

  if (!token && location !== "/login") {
    return <Redirect to="/login" />;
  }
  if (token && location === "/login") {
    return <Redirect to="/dashboard" />;
  }
  if (!token) {
    return <LoginPage />;
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminHeader username={username} />
      <Layout>
        <Sidebar />
        <Layout style={{ background: "#fff" }}>
          <main style={{ padding: 24, minHeight: 360 }}>
            <AppRoutes />
          </main>
        </Layout>
      </Layout>
    </Layout>
  );
}



