import React, { useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';

// services
import authService from 'services/authService';

// actions
import { setUserData } from 'actions/auth.action';

const Auth: FC = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    function initAuth() {
      authService.handleAuthentication();
      if (authService.isAuthenticated()) {
        const user = authService.getUser();
        if (user) {
          const parseUser = JSON.parse(user);
          dispatch(setUserData(parseUser, parseUser?.role));
        }
      }
    }
    initAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default Auth;
