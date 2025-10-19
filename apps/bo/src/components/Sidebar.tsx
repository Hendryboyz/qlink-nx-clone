import React, { ReactElement, useEffect, useState } from 'react';
import { MenuProps } from 'antd';
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
  CarOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';
import { BO_ACCESS_TOKEN, BO_REFRESH_TOKEN } from '@org/common';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

type ItemProps = {
  label: string;
  link?: string;
  icon: ReactElement;
  adminOnly?: boolean;
  clickHandler?: () => void;
  hidden: boolean;
};

type MenuItem = Required<MenuProps>['items'][number];

const renderLabel = (item: ItemProps) => {
  if (item.link) {
    return <Link to={item.link}>{item.label}</Link>;
  } else {
    return (
      <span onClick={item.clickHandler}>{item.label}</span>
    );
  }
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove(BO_ACCESS_TOKEN);
    Cookies.remove(BO_REFRESH_TOKEN);
    navigate('/login');
  };

  const menuItems: ItemProps[] = [
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: <DashboardOutlined />,
      hidden: false,
    },
    {
      label: 'Member Management',
      link: '/members',
      icon: <UserOutlined />,
      adminOnly: true,
      hidden: false,
    },
    {
      label: 'Vehicles Management',
      link: '/vehicles',
      icon: <CarOutlined />,
      adminOnly: true,
      hidden: false,
    },
    {
      label: 'User & Role',
      link: '/users',
      icon: <UserOutlined />,
      adminOnly: true,
      hidden: false,
    },
    {
      label: 'Dealer Management',
      link: '/dealers',
      icon: <ShopOutlined />,
      adminOnly: true,
      hidden: true,
    },
    {
      label: 'Advertisement Management',
      link: '/advertisements',
      icon: <NotificationOutlined />,
      hidden: true,
    },
    {
      label: 'Coupon Management',
      link: '/coupons',
      icon: <GiftOutlined />,
      hidden: true,
    },
    {
      label: 'Report Data',
      link: '/reports',
      icon: <BarChartOutlined />,
      adminOnly: true,
      hidden: true,
    },
    {
      label: 'Post Management',
      link: '/post-management',
      icon: <FileTextOutlined />,
      hidden: false,
    },
    {
      label: 'Logout',
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

  const availableMenuItems = menuItems.filter(
    (item: ItemProps) =>
      !item.hidden && (!item.adminOnly || (user && user.role === 'admin'))
  );

  const getKeysFromPath = (path: string): number => {
    const selectedKey = availableMenuItems.findIndex(
      (item) => item.link === path
    );
    if (selectedKey === -1) return 1;
    return selectedKey;
  };

  const itemElements: MenuItem[] = availableMenuItems.map(
    (item: ItemProps, index: number) => ({
      title: item.label,
      key: index,
      icon: item.icon,
      label: renderLabel(item),
    })
  );

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
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        items={itemElements}
      />
    </Sider>
  );
};

export default Sidebar;
