import React, { useEffect, FC, ReactNode } from "react";
import { useDispatch } from "react-redux";

// services
import authService from "../../services/authServices";

// actions
import { setUserData, setUserProfile } from "../../Action/AuthAction";

type Props = {
  children: ReactNode;
};

const Auth: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    function initAuth() {
      authService.handelAuthentication();
      if (authService.isAuthenticated()) {
        const user = authService.getUser();
        if (user) {
          const parseUser = JSON.parse(user);
          dispatch<any>(setUserData(parseUser, parseUser.role));
          dispatch<any>(setUserProfile(parseUser.profilePicture));
        }
      }
    }
    initAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default Auth;
