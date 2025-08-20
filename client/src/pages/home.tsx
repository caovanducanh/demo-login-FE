import React from "react";
import { Typography } from "antd";

const HomePage: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <main
        style={{
          padding: 24,
          minHeight: 360,
          maxWidth: 700,
          margin: "32px auto 0 auto",
        }}
      >
        <Typography.Title level={2}>Chào mừng đến trang chủ</Typography.Title>
        <p>Đây là trang chủ cho user MEMBER.</p>
      </main>
    </div>
  );
};

export default HomePage;
