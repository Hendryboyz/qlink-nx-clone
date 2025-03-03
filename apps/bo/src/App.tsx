import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/Dashboard';
import MemberManagement from './pages/MemberManagement';
import DealerManagement from './pages/DealerManagement';
import AdvertisementManagement from './pages/AdvertisementManagement';
import CouponManagement from './pages/CouponManagement';
import ReportData from './pages/ReportData';
import PostManagement from './pages/PostManagement';
import { BoRole } from '@org/types';
import CreateUser from './pages/CreateUser';

const { Content } = Layout;

const MainLayout = ({ collapsed }: { collapsed: boolean }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Layout
      style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}
    >
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <Outlet />
      </Content>
    </Layout>
  </Layout>
);

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const routerBasename: string = import.meta.env.VITE_BO_ROUTER_BASENAME || '';
  return (
    <ConfigProvider locale={enUS}>
      <Router basename={routerBasename}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <>
                  <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                  <MainLayout collapsed={collapsed} />
                </>
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN, BoRole.AGENT]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="members"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN]}>
                  <MemberManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="dealers"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN]}>
                  <DealerManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="advertisements"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN, BoRole.AGENT]}>
                  <AdvertisementManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="coupons"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN, BoRole.AGENT]}>
                  <CouponManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="reports"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN]}>
                  <ReportData />
                </PrivateRoute>
              }
            />
            <Route
              path="post-management"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN, BoRole.AGENT]}>
                  <PostManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="create-user"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN]}>
                  <CreateUser />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
