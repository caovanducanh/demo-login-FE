import React, { useMemo, useEffect, useState } from "react";
import { useLocation, Redirect } from "wouter";
import { Layout } from "antd";
import { Sidebar } from "./components/layout/sidebar";
import AppHeader from "./components/layout/AppHeader";
import AppRoutes from "./routes/AppRoutes";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { jwtDecode } from "jwt-decode";

import HumanVerifyScreen from "./components/HumanVerifyScreen";
import { decode as decodeJwt } from "./service/jwt";

interface JwtPayload {
  sub: string;
  roles: string[];
}

// Cloudflare Turnstile sitekey
const TURNSTILE_SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY;

export default function App() {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Nếu chạy ở localhost thì bỏ qua xác minh human
  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocalhost) {
      setIsHumanVerified(true);
      setTurnstileToken(null);
      return;
    }
    const savedToken = localStorage.getItem("HUMAN_VERIFY_TOKEN");
    if (savedToken) {
      const payload = decodeJwt(savedToken);
      const now = Math.floor(Date.now() / 1000);
      if (payload && payload.exp && payload.exp > now) {
        setIsHumanVerified(true);
        setTurnstileToken(null);
        return;
      } else {
        localStorage.removeItem("HUMAN_VERIFY_TOKEN");
      }
    }
    setIsHumanVerified(false);
    setTurnstileToken(null);
  }, []);

  // Khi có token Turnstile, gọi BE để đổi lấy HUMAN_VERIFY_TOKEN
  useEffect(() => {
    if (turnstileToken) {
      setVerifying(true);
      setVerifyError(null);
      import("./lib/apis/humanVerifyApi").then(({ verifyHuman }) => {
        verifyHuman(turnstileToken)
          .then((res) => {
            if (res.verifyToken) {
              setIsHumanVerified(true);
              localStorage.setItem("HUMAN_VERIFY_TOKEN", res.verifyToken);
              setTurnstileToken(null);
            } else {
              setIsHumanVerified(false);
              setVerifyError("Không nhận được token xác thực từ server!");
              localStorage.removeItem("HUMAN_VERIFY_TOKEN");
            }
          })
          .catch((err) => {
            setVerifyError(err?.response?.data?.message || "Xác minh robot thất bại!");
            setIsHumanVerified(false);
            localStorage.removeItem("HUMAN_VERIFY_TOKEN");
          })
          .finally(() => setVerifying(false));
      });
    }
  }, [turnstileToken]);

  // Inject script Turnstile
  useEffect(() => {
    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
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

  // Nếu chưa xác minh thì render HumanVerifyScreen
  if (!isHumanVerified) {
    // Reset verifyError mỗi lần render màn hình xác minh
    useEffect(() => {
      setVerifyError(null);
    }, []);
    // Callback nhận token và gọi BE ngay lập tức
    const handleVerify = (token: string) => {
      if (!token) return;
      setVerifying(true);
      setVerifyError(null);
      import("./lib/apis/humanVerifyApi").then(({ verifyHuman }) => {
        verifyHuman(token)
          .then((res) => {
            if (res.verifyToken) {
              setIsHumanVerified(true);
              localStorage.setItem("HUMAN_VERIFY_TOKEN", res.verifyToken);
              setTurnstileToken(null);
            } else {
              setIsHumanVerified(false);
              setVerifyError("Không nhận được token xác thực từ server!");
              localStorage.removeItem("HUMAN_VERIFY_TOKEN");
            }
          })
          .catch((err) => {
            setVerifyError(err?.response?.data?.message || "Xác minh robot thất bại!");
            setIsHumanVerified(false);
            localStorage.removeItem("HUMAN_VERIFY_TOKEN");
          })
          .finally(() => setVerifying(false));
      });
    };
    return (
      <HumanVerifyScreen
        sitekey={TURNSTILE_SITEKEY}
        verifying={verifying}
        verifyError={verifyError}
        onVerify={handleVerify}
      />
    );
  }

  // Các flags route
  const isHome = location === "/home" || location === "/";
  const isProfile = location === "/profile";
  const isLogin = location === "/login";
  const isRegister = location === "/register";

  if (!token && !isHome && !isLogin && !isRegister && !isProfile) {
    return <Redirect to="/home" />;
  }
  if (token && (isLogin || isRegister)) {
    return <Redirect to={isMember ? "/home" : "/dashboard"} />;
  }
  if (isLogin) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#fff" }}>
        <AppHeader />
        <main style={{ padding: 24, minHeight: 360 }}>
          <LoginPage />
        </main>
      </Layout>
    );
  }
  if (isRegister) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#fff" }}>
        <AppHeader />
        <main style={{ padding: 24, minHeight: 360 }}>
          <RegisterPage />
        </main>
      </Layout>
    );
  }
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
