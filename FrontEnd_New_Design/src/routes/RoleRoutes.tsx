import React, { FC, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// configs
import { PATH_NAME } from "../Config";

// selectors
import { roleSelector } from "../Selectors/authSelector";

type IProps = {
  requireRoles: string[] | [];
  children: ReactNode;
};

const RoleRoute: FC<IProps> = ({ children, requireRoles = [] }) => {
  const history = useNavigate();
  const role = useSelector(roleSelector);

  useEffect(() => {
    if (!role || requireRoles.length === 0) return;
    const checkRole = requireRoles.includes(role);
    if (!checkRole) {
      history(PATH_NAME.ERROR403);
    }
  }, [history, role, requireRoles]);

  return <>{children}</>;
};

export default RoleRoute;
