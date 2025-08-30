import React from "react";
import { Layout } from "antd";
import TurnstileWidget from "./TurnstileWidget";

interface Props {
  sitekey: string;
  verifying: boolean;
  verifyError: string | null;
  onVerify: (token: string) => void;
}

export default function HumanVerifyScreen({ sitekey, verifying, verifyError, onVerify }: Props) {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "var(--bg-color)",
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          background: "var(--bg-color)",
          color: "var(--text-color)",
          transition: "all 0.3s ease",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>
          Xác minh bạn không phải robot
        </h1>

        <div
          style={{
            transform: "scale(1.5)", // phóng to widget
            transformOrigin: "center",
          }}
        >
          <TurnstileWidget sitekey={sitekey} onVerify={onVerify} />
        </div>

        {verifying && (
          <div style={{ fontSize: 18 }}>Đang xác minh...</div>
        )}
        {verifyError && (
          <div style={{ fontSize: 18, color: "red" }}>{verifyError}</div>
        )}
      </div>
    </Layout>
  );
}
