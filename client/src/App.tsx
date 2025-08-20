import React, { useMemo } from "react";
import { useLocation, Redirect } from "wouter";
import { Layout } from "antd";
import { Sidebar } from "./components/layout/sidebar";
import AppHeader from "./components/layout/AppHeader"; 
import AppRoutes from "./routes/AppRoutes";
import LoginPage from "./pages/login";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  roles: string[];
}

export default function App() {
  const [location] = useLocation();
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }, [token]);

  const roles: string[] = user?.roles || [];
  const isMember = roles.length === 1 && roles[0] === "MEMBER";

  // Chưa login → ép về /login
  if (!token && location !== "/login") {
    return <Redirect to="/login" />;
  }

  // Đã login nhưng vẫn ở /login → redirect theo role
  if (token && location === "/login") {
    return <Redirect to={isMember ? "/home" : "/dashboard"} />;
  }

  // Không có token thì hiển thị trang login
  if (!token) {
    return <LoginPage />;
  }

  // Member → chỉ hiển thị routes đơn giản (home, profile) kèm header chung
  if (isMember && (location === "/home" || location === "/" || location === "/profile")) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#fff" }}>
        <AppHeader />
        <main style={{ padding: 24, minHeight: 360 }}>
          <AppRoutes />
        </main>
      </Layout>
    );
  }

  // Admin → layout đầy đủ có sidebar + header
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
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
