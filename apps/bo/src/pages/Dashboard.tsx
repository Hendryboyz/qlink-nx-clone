import React from 'react';
import { Row, Col, Flex } from 'antd';
import {
  FailVerificationVehiclesCount,
  NewUserThisMonthStatistic,
  TotalUsersStatistic, VehicleModelDistributionChart
} from '$/components/DashboardStatistic';

const Dashboard: React.FC = () => {
  console.log('Dashboard component rendered'); // 添加這行來檢查組件是否被渲染
  // const data = MODEL_TITLES.map(model => ({
  //   name: model,
  //   value: 1
  // }));

  return (
    <div>
      <h1>Dashboard</h1>
      <Flex vertical flex={1} gap={15}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <TotalUsersStatistic />
          </Col>
          <Col span={8}>
            <NewUserThisMonthStatistic />
          </Col>
          <Col span={8}>
            <FailVerificationVehiclesCount />
          </Col>
        </Row>
        <VehicleModelDistributionChart />
      </Flex>
    </div>
  );
};

export default Dashboard;
