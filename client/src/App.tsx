import React, { useMemo, useEffect } from "react";
import { useLocation, Redirect } from "wouter";
import { Layout } from "antd";
import { Sidebar } from "./components/layout/sidebar";
import AppHeader from "./components/layout/AppHeader";
import AppRoutes from "./routes/AppRoutes";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  roles: string[];
}

// Cloudflare Turnstile sitekey
const TURNSTILE_SITEKEY = "0x4AAAAAABwUJEbeH28XFEpH";

export default function App() {
  // Inject Turnstile script vào head khi app mount
  useEffect(() => {
    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
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

  // Các flag location
  const isHome = location === "/home" || location === "/";
  const isProfile = location === "/profile";
  const isLogin = location === "/login";
  const isRegister = location === "/register";

  // Nếu chưa login và không phải home, login, register, profile → redirect về home
  if (!token && !isHome && !isLogin && !isRegister && !isProfile) {
    return <Redirect to="/home" />;
  }

  // Nếu đã login mà vào login/register → redirect theo role
  if (token && (isLogin || isRegister)) {
    return <Redirect to={isMember ? "/home" : "/dashboard"} />;
  }

  // Trang login
  if (isLogin) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#fff" }}>
        <AppHeader />
        <main style={{ padding: 24, minHeight: 360 }}>
          {/* Turnstile widget sẽ được render trong LoginPage */}
          <LoginPage />
        </main>
      </Layout>
    );
  }

  // Trang register
  if (isRegister) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#fff" }}>
        <AppHeader />
        <main style={{ padding: 24, minHeight: 360 }}>
          {/* Turnstile widget sẽ được render trong RegisterPage nếu cần */}
          <RegisterPage />
        </main>
      </Layout>
    );
  }

  // Trang home hoặc profile
  if (isHome || isProfile) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#fff" }}>
        <AppHeader />
        <main style={{ padding: 24, minHeight: 360 }}>
          <AppRoutes />
        </main>
      </Layout>
    );
  }

  // Member → layout đơn giản
  if (isMember) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#fff" }}>
        <AppHeader />
        <main style={{ padding: 24, minHeight: 360 }}>
          <AppRoutes />
        </main>
      </Layout>
    );
  }

  // Admin → layout đầy đủ
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
