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

type ItemProps = {
  title: string;
  link?: string;
  icon: JSX.Element;
  adminOnly?: boolean;
  clickHandler?: () => void;
  hidden: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems: ItemProps[] = [
    {
      title: 'Dashboard',
      link: '/dashboard',
      icon: <DashboardOutlined />,
      hidden: false,
    },
    {
      title: 'Member Management',
      link: '/members',
      icon: <UserOutlined />,
      adminOnly: true,
      hidden: false,
    },
    {
      title: 'Dealer Management',
      link: '/dealers',
      icon: <ShopOutlined />,
      adminOnly: true,
      hidden: true,
    },
    {
      title: 'Advertisement Management',
      link: '/advertisements',
      icon: <NotificationOutlined />,
      hidden: true,
    },
    {
      title: 'Coupon Management',
      link: '/coupons',
      icon: <GiftOutlined />,
      hidden: true,
    },
    {
      title: 'Report Data',
      link: '/reports',
      icon: <BarChartOutlined />,
      adminOnly: true,
      hidden: true,
    },
    {
      title: 'Post Management',
      link: '/post-management',
      icon: <FileTextOutlined />,
      hidden: false,
    },
    {
      title: 'Logout',
      icon: <LogoutOutlined />,
      clickHandler: handleLogout,
      hidden: false,
    },
  ];

  useEffect(() => {
    const path = location.pathname;
    const key = getKeysFromPath(path);
    setSelectedKeys([key.toString()]);
  }, [location]);

  const getKeysFromPath = (path: string): number => {
    const selectedKey = menuItems.findIndex(item => item.link === path);
    if (selectedKey === -1) return 1;
    return selectedKey;
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
        { menuItems
          .filter((item: ItemProps) =>
            !item.hidden &&
            (!item.adminOnly
            || (user && user.role === 'admin'))
          )
          .map((item: ItemProps, index: number) => (
            <Menu.Item key={index} icon={item.icon} onClick={item.clickHandler}>
              { item.link ? <Link to={item.link}>{item.title}</Link> : item.title }
            </Menu.Item>
          ))
        }
      </Menu>
    </Sider>
  );
};

export default Sidebar;
