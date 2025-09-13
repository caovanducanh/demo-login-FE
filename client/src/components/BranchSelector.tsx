import React from "react";
import { Card, Typography, Button, Spin, Alert, Row, Col } from "antd";
import { useBranch } from "../hooks/use-branch";
import type { Branch } from "../types/branch";

const { Title, Text } = Typography;

interface BranchSelectorProps {
  onBranchSelected?: (branch: Branch) => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ onBranchSelected }) => {
  const { branches, isLoading, error, loginWithGoogle } = useBranch();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spin size="large" />
        <div style={{ marginTop: "1rem" }}>
          <Text>Đang tải danh sách chi nhánh...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải danh sách chi nhánh. Vui lòng thử lại sau."
        type="error"
        showIcon
      />
    );
  }

  const handleBranchSelect = (branch: Branch) => {
    onBranchSelected?.(branch);
    // Directly initiate Google login with selected branch
    loginWithGoogle(branch.code);
  };

  return (
    <div>
      <Title level={3} style={{ textAlign: "center", marginBottom: "2rem" }}>
        Chọn chi nhánh để đăng nhập
      </Title>
      
      <Row gutter={[24, 24]} justify="center">
        {branches.map((branch) => (
          <Col xs={24} sm={12} md={12} lg={10} xl={8} key={branch.id}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "2px solid #f0f0f0",
                transition: "all 0.3s ease",
                height: "100%",
              }}
              bodyStyle={{ 
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}
              className="branch-card"
            >
              <div style={{ flex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1890ff, #40a9ff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem",
                      fontSize: "24px",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {branch.code}
                  </div>
                  <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                    {branch.name}
                  </Title>
                </div>
                
                <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                  <Text type="secondary" style={{ fontSize: "0.9rem" }}>
                    📍 {branch.address}
                  </Text>
                </div>
                
                <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                  <Text type="secondary" style={{ fontSize: "0.85rem" }}>
                    👥 {branch.allowedEmails.length} email được phép
                  </Text>
                </div>
              </div>
              
              <Button
                type="primary"
                size="large"
                block
                onClick={() => handleBranchSelect(branch)}
                style={{
                  borderRadius: 12,
                  height: 56,
                  fontSize: "16px",
                  fontWeight: "500",
                  background: "linear-gradient(135deg, #1890ff, #40a9ff)",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
                }}
                icon={
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    style={{
                      width: 20,
                      marginRight: 8,
                      verticalAlign: "middle",
                    }}
                  />
                }
              >
                Đăng nhập với Google
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Alert
          message="Thông tin quan trọng"
          description="Bạn chỉ có thể đăng nhập bằng email được phép cho chi nhánh đã chọn. Vui lòng liên hệ quản trị viên nếu email của bạn chưa được thêm vào danh sách."
          type="info"
          showIcon
        />
      </div>

      <style>{`
        .branch-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
          border-color: #1890ff !important;
        }
        .branch-card {
          transition: all 0.3s ease !important;
        }
      `}</style>
    </div>
  );
};

export default BranchSelector;
