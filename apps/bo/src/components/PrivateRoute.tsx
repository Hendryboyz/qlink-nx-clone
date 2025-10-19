import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { BoUser, BoRole } from '@org/types';
import Cookies from 'js-cookie';
import { BO_ACCESS_TOKEN } from '@org/common';
import API from '../utils/fetch';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: BoRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const [isRequestDataAllowed, setIsRequestDataAllowed] = useState(true);

  useEffect(() => {
    async function verifyAccessToken() {
      const accessToken = Cookies.get(BO_ACCESS_TOKEN);
      // const refreshToken = Cookies.get(BO_REFRESH_TOKEN);
      if (accessToken === undefined) {
        setIsRequestDataAllowed(false);
        return;
      }
      try {
        const { authenticated } = await API.check();
        console.debug(`Authenticated: ${authenticated}`);
        setIsRequestDataAllowed(true);
      } catch (err) {
        console.error(err);
        setIsRequestDataAllowed(false);
      }
    }
    verifyAccessToken();
  }, [location.pathname]);
  if (!isRequestDataAllowed) {
    console.warn('API token NOT found');
    Cookies.remove(BO_ACCESS_TOKEN);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userString = localStorage.getItem('user');
  const user: BoUser | null = userString ? JSON.parse(userString) : null;
  if (!user) {
    console.warn('user NOT found');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
