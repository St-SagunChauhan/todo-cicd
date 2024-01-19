import React, { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

// material core
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { FaUserLarge } from 'react-icons/fa6';

// configs
import { PATH_NAME } from 'configs';

// actions
import { logout } from 'actions/auth.action';

import { Avatar, Link } from '@material-ui/core';
import { makeStyles } from '@mui/styles';
import authService from 'services/authService';
import profile from 'assets/images/Profile.png';

function Account({ ...classes }) {
  const { t: translate } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const role = authService.getRole();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let loggedInUser = [];

  if (authService.getUser()) {
    loggedInUser = JSON.parse(authService.getUser());
  }

  const userProfile =
    loggedInUser?.profilePicture !== 'string' ? `data:image/png;base64,${loggedInUser?.profilePicture}` : profile;

  const _handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const _handleClose = () => {
    setAnchorEl(null);
  };

  const _handleLogout = () => {
    dispatch(logout());
    history.push(PATH_NAME.LOGIN);
    setAnchorEl(null);
  };

  console.log(loggedInUser?.profilePicture);
  return (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        style={{ backgroundColor: '#f1416c', borderRadius: '10px', height: '50px', width: '50px' }}
        aria-haspopup="true"
        onClick={_handleMenu}
        color="inherit"
      >
        <Avatar style={{ width: 40, height: 40 }}>
          {loggedInUser?.profilePicture ? <img height="100%" width="100%" src={userProfile} /> : <FaUserLarge />}
        </Avatar>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={_handleClose}
      >
        <div
          className={classes.textRole}
          style={{ backgroundColor: '#f1416c', color: '#fff', width: '80px', marginLeft: '20px', borderRadius: '5px' }}
        >
          {role}
        </div>
        <Divider />
        <MenuItem>
          {' '}
          <Link href={PATH_NAME.PROFILE}>My Account</Link>{' '}
        </MenuItem>
        <MenuItem className={classes.menuProfile} onClick={_handleLogout}>
          {translate('LOGOUT')}
        </MenuItem>
      </Menu>
    </>
  );
}

export default memo(Account);
