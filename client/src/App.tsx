import React, { useMemo, useEffect, useState } from "react";
import TurnstileWidget from "./components/TurnstileWidget";
// Cloudflare Turnstile sitekey
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
const TURNSTILE_SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY;

import { decode as decodeJwt } from "./service/jwt";

export default function App() {
  // State lưu token xác minh robot cho toàn app
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  // Trạng thái xác thực human
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Khi vào web, kiểm tra localStorage có HUMAN_VERIFY_TOKEN chưa và còn hạn không
  useEffect(() => {
    const savedToken = localStorage.getItem("HUMAN_VERIFY_TOKEN");
    if (savedToken) {
      const payload = decodeJwt(savedToken);
      const now = Math.floor(Date.now() / 1000);
      if (payload && payload.exp && payload.exp > now) {
        // Token còn hạn, xác thực với backend
        setVerifying(true);
        setVerifyError(null);
        import("./lib/apis/humanVerifyApi").then(({ verifyHuman }) => {
          verifyHuman(savedToken)
            .then(() => {
              setIsHumanVerified(true);
              setTurnstileToken(null);
            })
            .catch((err) => {
              setVerifyError(err?.response?.data?.message || "Xác minh robot thất bại!");
              setIsHumanVerified(false);
              setTurnstileToken(null);
              localStorage.removeItem("HUMAN_VERIFY_TOKEN");
            })
            .finally(() => setVerifying(false));
        });
        return;
      } else {
        // Token hết hạn
        localStorage.removeItem("HUMAN_VERIFY_TOKEN");
      }
    }
    setIsHumanVerified(false);
    setTurnstileToken(null);
  }, []);

  // Khi nhận được turnstileToken mới từ Cloudflare, gửi lên BE để lấy HUMAN_VERIFY_TOKEN và lưu vào localStorage nếu thành công
  useEffect(() => {
    if (turnstileToken) {
      setVerifying(true);
      setVerifyError(null);
      import("./lib/apis/humanVerifyApi").then(({ verifyHuman }) => {
        verifyHuman(turnstileToken)
          .then((res) => {
            // BE trả về { verifyToken }
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
  // Inject Turnstile script vào head khi app mount
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
          {/* Turnstile widget toàn cục */}
          {!isHumanVerified && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <TurnstileWidget sitekey={TURNSTILE_SITEKEY} onVerify={setTurnstileToken} />
            </div>
          )}
          {verifyError && (
            <div style={{ color: "red", textAlign: "center", marginBottom: 16 }}>{verifyError}</div>
          )}
          {verifying && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>Đang xác minh...</div>
          )}
          {isHumanVerified ? <LoginPage /> : <div style={{ textAlign: "center" }}>Vui lòng xác minh bạn không phải robot để tiếp tục đăng nhập.</div>}
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
          {/* Turnstile widget toàn cục */}
          {!isHumanVerified && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <TurnstileWidget sitekey={TURNSTILE_SITEKEY} onVerify={setTurnstileToken} />
            </div>
          )}
          {verifyError && (
            <div style={{ color: "red", textAlign: "center", marginBottom: 16 }}>{verifyError}</div>
          )}
          {verifying && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>Đang xác minh...</div>
          )}
          {isHumanVerified ? <RegisterPage /> : <div style={{ textAlign: "center" }}>Vui lòng xác minh bạn không phải robot để tiếp tục đăng ký.</div>}
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
