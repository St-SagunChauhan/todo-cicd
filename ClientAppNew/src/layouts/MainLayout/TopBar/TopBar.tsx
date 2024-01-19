import React, { memo } from 'react';

// libs
import clsx from 'clsx';
import { PATH_NAME, USER_ROLE } from 'configs';

// material core
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

// material icon
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from 'react-icons/io';

// components
import authService from 'services/authService';

// styles
import empService from 'services/emp.Request';
import { useHistory } from 'react-router';
import { Box, Button } from '@material-ui/core';
import Account from './components/Account';
import useStyles from './styles';

type IProps = {
  handleToogleDrawer: () => void;
  isDrawer: boolean;
};

export default function TopBar({ isDrawer, handleToogleDrawer }: IProps) {
  const role = authService.getRole();
  let path = '';
  if (role === USER_ROLE.TEAMLEAD) {
    path = PATH_NAME.ROOT;
  } else if (role === USER_ROLE.ADMIN) {
    path = PATH_NAME.MASTER_REPORT;
  } else if (role === USER_ROLE.HR) {
    path = PATH_NAME.EMPLOYEE;
  } else {
    path = PATH_NAME.PROFILE;
  }

  let loggedInUser: any = [];
  const history = useHistory();

  const isPersonating = localStorage.getItem('impersonating');

  if (authService.getUser()) {
    loggedInUser = JSON.parse(authService.getUser());
  }

  const handleStopImpersonation = async () => {
    try {
      // Retrieve the authenticated user's ID from the localStorage or your authentication system.
      // Adjust the key based on how the user ID is stored in the token.

      const loggedInUser = JSON.parse(authService.getUser());
      localStorage.getItem(loggedInUser.employeeId);
      const adminId = localStorage.getItem('impersonator');
      console.log({ adminId, loggedInUser });
      if (adminId && loggedInUser) {
        const response = await empService.stopImpersonation(loggedInUser.employeeId, adminId);

        // Check the response status to handle success or error
        if (response.status == 200) {
          // console.log(response);
          authService.setSession('accessToken', response.data.api_token);
          authService.setSession('user', JSON.stringify(response.data.user));
          authService.setSession('role', response.data.user.role);
          localStorage.removeItem('impersonating');
          if (authService.getRole() === 'TeamLead') {
            history.push(PATH_NAME.ROOT);
          } else if (authService.getRole() === 'Admin') {
            history.push(PATH_NAME.MASTER_REPORT);
          } else if (authService.getRole() === 'HR') {
            history.push(PATH_NAME.EMPLOYEE);
          } else {
            history.push(PATH_NAME.PROFILE);
          }
          window.location.reload();
        } else {
          // Handle API errors if needed
          console.error('Error stopping impersonation:', response.data.Message);
        }
      }
    } catch (error) {
      // Handle any other errors that might occur (e.g., network issues)
      console.error('Error stopping impersonation:', error);
    }
  };

  const classes = useStyles();

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: isDrawer,
        [classes.positionFixed]: !isDrawer,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleToogleDrawer}
          edge="start"
          className={clsx(classes.menuButton)}
        >
          {isDrawer ? <IoMdArrowDropleftCircle /> : <IoMdArrowDroprightCircle />}
        </IconButton>
        <div>
          {/* Display "Stop Impersonation" button when impersonation is true */}
          {isPersonating === 'true' && (
            <Box style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
              <Button variant="contained" color="secondary" size="small" onClick={handleStopImpersonation}>
                Stop Impersonation
              </Button>
            </Box>
          )}
        </div>
        <div className={classes.grow} />
        <div className={classes.topBar_setting}>
          <Account {...classes} />
        </div>
      </Toolbar>
    </AppBar>
  );
}
