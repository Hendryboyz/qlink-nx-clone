import React, { useEffect, useState } from 'react';
import { Card, Skeleton, Statistic } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import API from '$/utils/fetch';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

export const TotalUsersStatistic: React.FC = () => {
  const [totalUserCount, setTotalUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchTotalUserCount() {
      setLoading(true);
      try {
        const fetchResult = await API.countTotalMember();
        setTotalUserCount(fetchResult);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTotalUserCount();
  }, []);
  return (
    <Card>
      {loading && <Skeleton paragraph={{rows: 1}} />}
      {!loading && (
        <Statistic
          title="Total Members"
          value={totalUserCount}
          prefix={<UserOutlined />}
        />
      )}
    </Card>

  );
}

export const NewUserThisMonthStatistic: React.FC = () => {
  const [newUserCount, setNewUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchNewUserThisMonthCount() {
      setLoading(true);
      try {
        const today = new Date();
        const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const fetchResult = await API.countTotalMember(firstDayThisMonth);
        setNewUserCount(fetchResult);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchNewUserThisMonthCount();
  }, []);
  return (
    <Card>
      {loading && <Skeleton paragraph={{rows: 1}} />}
      {!loading && (
        <Statistic
          title="New Members this Month"
          value={newUserCount}
          prefix={<UserOutlined />}
        />
      )}
    </Card>
  );
}

export const FailVerificationVehiclesCount: React.FC = () => {
  const [failureCount, setFailureCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchFailureCount() {
      setLoading(true);
      try {
        const fetchResult = await API.countFailVerificationVehicles();
        setFailureCount(fetchResult);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchFailureCount();
  }, []);

  return (
    <Card>
      {loading && <Skeleton paragraph={{rows: 1}} />}
      {!loading && (
        <Statistic
          title="Vehicles Validation Fail"
          value={failureCount}
        />
      )}
    </Card>
  );
}

type EChartsOption = echarts.EChartsOption;

type ModelsCount = {
  name: string;
  value: number;
}[];

const MODEL_TITLES = [
  'AGRO 150',
  'AGRO 200',
  'AGRO-II 150',
  'CG 125-I',
  'CHAMPION 200',
  'CRUISER 125',
  'D-SUPER 150',
  'FIRE 150',
  'G12 125',
  'G13 125',
  'G8 125 Alloy',
  'G8 125 Spoke',
  'GD 110',
  'GUNNER-I 125',
  'LUCKY ULTRA 110',
  'MONSTER 150',
  'QG 125',
  'RACER 250',
  'RAPTOR 250',
  'RANGER 125',
  'RANGER 150',
  'REIZ 110',
  'RKT 200',
  'SPRINT 150',
  'SUPER RANGER 200',
  'TARGET 110',
  'TIGER 150',
  'TIGER 160',
  'TIGER 200',
  'UD ULTRA 110',
  'VELOCITY 110',
  'WISDOM 110',
  'XPREZ 125'
];

export const VehicleModelDistributionChart: React.FC = () => {
  const [vehicleModelsCount, setVehicleModelCount] = useState<ModelsCount>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchModelDistribution() {
      setLoading(true);
      try {
        const fetchResults = await API.countVehiclesByField('model');
        const chartData = fetchResults
          .filter((eachResult) => MODEL_TITLES.includes(eachResult.model))
          .map((eachResult) => ({
            name: eachResult.model,
            value: eachResult.count
          }));
        setVehicleModelCount(chartData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchModelDistribution();
  }, []);

  const options: EChartsOption = {
    title: {
      show: false,

    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '55%',
        data: vehicleModelsCount,
        top: -100,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <Card title="Register Vehicle Model" style={{ width: '60%' }}>
      {loading && <Skeleton paragraph={{rows: 1}} />}
      {!loading && (
        <ReactECharts
          option={options}
          style={{ height: 400 }}
        />
      )}
    </Card>
  );

}
