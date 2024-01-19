import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { PATH_NAME } from "../../Config";
import authService from "../../services/authServices";

type Props = {
  children: ReactNode;
};

const GuestGuard: React.FunctionComponent<Props> = ({ children }) => {
  const isAuth = authService.getAccessToken();
  if (isAuth) return <Navigate to={PATH_NAME.ROOT} replace />;
  return <>{children}</>;
};

export default GuestGuard;
