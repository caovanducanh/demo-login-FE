import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../lib/api";
import { Card, Typography, Descriptions, Spin, message } from "antd";

const Profile: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery(["current-user"], fetchCurrentUser);

  React.useEffect(() => {
    if (isError && error instanceof Error) {
      message.error(error.message);
    }
  }, [isError, error]);

  if (isLoading) return <Spin style={{ margin: 32 }} />;
  if (!data) return null;

  return (
    <Card style={{ maxWidth: 500, margin: "32px auto" }}>
      <Typography.Title level={3}>Profile</Typography.Title>
      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Username">{data.username}</Descriptions.Item>
        <Descriptions.Item label="Full Name">{data.fullName}</Descriptions.Item>
        <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{data.phone}</Descriptions.Item>
        <Descriptions.Item label="Address">{data.address}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">{data.dateOfBirth}</Descriptions.Item>
        <Descriptions.Item label="Identity Card">{data.identityCard}</Descriptions.Item>
        <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
        <Descriptions.Item label="Status">{data.status}</Descriptions.Item>
        <Descriptions.Item label="Created Date">{data.createdDate}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default Profile;
