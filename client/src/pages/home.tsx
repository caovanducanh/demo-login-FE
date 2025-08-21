import React from "react";
import { Typography, Card } from "antd";

const HomePage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f2f5 0%, #ffffff 100%)",
        padding: 16,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 700,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginTop: 48,
        }}
        className="home-card"
      >
        <Typography.Title
          level={2}
          style={{ marginBottom: 16, textAlign: "center" }}
          className="home-title"
        >
          Chào mừng đến trang chủ
        </Typography.Title>
        <Typography.Paragraph style={{ fontSize: 16, textAlign: "center" }}>
          Đây là trang chủ cho user <b>MEMBER</b>.
        </Typography.Paragraph>

        <style>{`
          @media (max-width: 600px) {
            .home-card {
              margin-top: 24px !important;
              padding: 12px !important;
            }
            .home-title {
              font-size: 20px !important;
            }
            .home-card .ant-typography {
              font-size: 14px !important;
            }
          }
        `}</style>
      </Card>
    </div>
  );
};

export default HomePage;
