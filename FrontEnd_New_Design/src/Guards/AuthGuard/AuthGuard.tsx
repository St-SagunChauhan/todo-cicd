import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { PATH_NAME } from "../../Config";
import authService from "../../services/authServices";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isAuth = authService.getAccessToken();
  if (!isAuth) return <Navigate to={PATH_NAME.LOGIN} replace />;
  const cheToken = authService.isValidToken(isAuth);
  if (!cheToken) {
    authService.logOut();
    return <Navigate to={PATH_NAME.LOGIN} replace />;
  }
  return <>{children}</>;
};

export default AuthGuard;
