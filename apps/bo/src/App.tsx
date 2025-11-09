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

import { BoRole } from '@org/types';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';

// the context
import UserContextProvider from '$/pages/UsersManagement/UsersContext';
import MemberContextProvider from '$/pages/MemberMangement/MemberContext';
import VehiclesContextProvider from '$/pages/VehiclesManagement/VehiclesContext';

// the pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehiclesManagement from '$/pages/VehiclesManagement';
import UsersManagement from '$/pages/UsersManagement';
import MemberManagement from './pages/MemberMangement';
import BannerManagement from '$/pages/BannerManagement';
import PostManagement from './pages/PostManagement';
import NotFound from '$/pages/NotFound';
import Unauthorized from './pages/Unauthorized';

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
            <Route index element={<Navigate to="/members" replace />} />
            <Route
              path="dashboard"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN, BoRole.VIEWER]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="members"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN]}>
                  <MemberContextProvider>
                    <MemberManagement />
                  </MemberContextProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="vehicles"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN]}>
                  <VehiclesContextProvider>
                    <VehiclesManagement />
                  </VehiclesContextProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="users"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN]}>
                  <UserContextProvider>
                    <UsersManagement />
                  </UserContextProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="post-management"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN, BoRole.VIEWER]}>
                  <PostManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="banners"
              element={
                <PrivateRoute allowedRoles={[BoRole.ADMIN, BoRole.VIEWER]}>
                  <BannerManagement />
                </PrivateRoute>
              }
            />
            {/*<Route*/}
            {/*  path="dealers"*/}
            {/*  element={*/}
            {/*    <PrivateRoute allowedRoles={[BoRole.ADMIN]}>*/}
            {/*      <DealerManagement />*/}
            {/*    </PrivateRoute>*/}
            {/*  }*/}
            {/*/>*/}

            {/*<Route*/}
            {/*  path="coupons"*/}
            {/*  element={*/}
            {/*    <PrivateRoute allowedRoles={[BoRole.ADMIN, BoRole.VIEWER]}>*/}
            {/*      <CouponManagement />*/}
            {/*    </PrivateRoute>*/}
            {/*  }*/}
            {/*/>*/}
            {/*<Route*/}
            {/*  path="reports"*/}
            {/*  element={*/}
            {/*    <PrivateRoute allowedRoles={[BoRole.ADMIN]}>*/}
            {/*      <ReportData />*/}
            {/*    </PrivateRoute>*/}
            {/*  }*/}
            {/*/>*/}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
