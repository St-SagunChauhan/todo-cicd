import React, { useState, useCallback, FC } from 'react';
import { Box } from '@material-ui/core';
import CustomizedBreadcrumbs from 'components/molecules/CustomizedBreadcrumbs/CustomizedBreadcrumbs';

// libs
import clsx from 'clsx';

// material core
import CssBaseline from '@material-ui/core/CssBaseline';

// containers
import ErrorBoundary from 'containers/ErrorBoundary';

// components
import NavBar from './NavBar';
import TopBar from './TopBar';

// styles
import useStyles from './styles';

const MainLayout: FC = ({ children }) => {
  const classes = useStyles();
  const [isDrawer, setIsDrawer] = useState(true);

  const _handleToogleDrawer = useCallback(() => {
    setIsDrawer(!isDrawer);
  }, [isDrawer]);

  return (
    <Box className={classes.root}>
      <CssBaseline />

      <TopBar isDrawer={isDrawer} handleToogleDrawer={_handleToogleDrawer} />

      <NavBar isDrawer={isDrawer} />

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isDrawer,
        })}
      >
        <div className={classes.toolbar} />
        <CustomizedBreadcrumbs />
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </Box>
  );
};

export default MainLayout;
