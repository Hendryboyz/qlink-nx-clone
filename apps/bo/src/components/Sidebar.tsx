import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  NotificationOutlined,
  GiftOutlined,
  BarChartOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const path = location.pathname;
    const key = getKeyFromPath(path);
    setSelectedKeys([key]);
  }, [location]);

  const getKeyFromPath = (path: string): string => {
    switch (path) {
      case '/dashboard':
        return '1';
      case '/members':
        return '2';
      case '/dealers':
        return '3';
      case '/advertisements':
        return '4';
      case '/coupons':
        return '5';
      case '/reports':
        return '6';
      case '/post-management':
        return 'post-management';
      default:
        return '1';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <div className="logo" />
      <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        {user && user.role === 'admin' && (
          <>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <Link to="/members">Member Management</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ShopOutlined />}>
              <Link to="/dealers">Dealer Management</Link>
            </Menu.Item>
          </>
        )}
        {/*<Menu.Item key="4" icon={<NotificationOutlined />}>*/}
        {/*  <Link to="/advertisements">Advertisement Management</Link>*/}
        {/*</Menu.Item>*/}
        <Menu.Item key="5" icon={<GiftOutlined />}>
          <Link to="/coupons">Coupon Management</Link>
        </Menu.Item>
        {/*{user && user.role === 'admin' && (*/}
        {/*  <Menu.Item key="6" icon={<BarChartOutlined />}>*/}
        {/*    <Link to="/reports">Report Data</Link>*/}
        {/*  </Menu.Item>*/}
        {/*)}*/}
        <Menu.Item key="post-management" icon={<FileTextOutlined />}>
          <Link to="/post-management">Post Management</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
