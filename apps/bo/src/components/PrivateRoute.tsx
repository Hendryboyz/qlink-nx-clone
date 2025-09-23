import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { BoUser, BoRole } from '@org/types';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: BoRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const userString = localStorage.getItem('user');
  const user: BoUser | null = userString ? JSON.parse(userString) : null;

  if (!user) {
    console.log('No user found');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
