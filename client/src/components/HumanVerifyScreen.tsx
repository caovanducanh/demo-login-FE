import React from "react";
import { Layout } from "antd";
import TurnstileWidget from "./TurnstileWidget";

interface Props {
  sitekey: string;
  verifying: boolean;
  verifyError: string | null;
  onVerify: (token: string) => void;
}

export default function HumanVerifyScreen({
  sitekey,
  verifying,
  verifyError,
  onVerify,
}: Props) {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "var(--bg-color)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "1rem",
          textAlign: "center",
          background: "var(--bg-color)",
          color: "var(--text-color)",
          transition: "all 0.3s ease",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.25rem, 4vw, 2rem)", // responsive
            fontWeight: 600,
            margin: 0,
          }}
        >
          Verify Human
        </h1>

        <p
          style={{
            fontSize: "clamp(0.9rem, 3vw, 1rem)",
            color: "var(--text-color-secondary)",
            marginTop: "0.5rem",
          }}
        >
          Please complete the verification to continue.
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 320, // tránh tràn màn
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TurnstileWidget sitekey={sitekey} onVerify={onVerify} />
        </div>

        {verifying && (
          <div style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)" }}>
            Verifying...
          </div>
        )}
        {verifyError && (
          <div
            style={{
              fontSize: "clamp(0.9rem, 3vw, 1rem)",
              color: "red",
              maxWidth: 300,
            }}
          >
            {verifyError}
          </div>
        )}
      </div>
    </Layout>
  );
}
