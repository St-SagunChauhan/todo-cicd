import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, matchPath } from 'react-router';

// material core
import { Divider, Drawer, List, ListSubheader } from '@material-ui/core';
// import CopyrightIcon from '@material-ui/icons/Copyright';

// configs
import { navBarCommon } from 'routes/navBarCommon';
import { PATH_NAME, VERSION_PROJECT } from 'configs';

// types
import { IChildNavBar } from 'models/INavBar';
import NavBarItem from './NavBarItem';

// styles
import useStyles from './styles';

type IProps = {
  isDrawer: boolean;
};

type IChildRoutes = {
  acc: any;
  curr: any;
  pathname: string;
  depth?: number;
  label?: string;
};

function NavBar({ isDrawer }: IProps) {
  const classes = useStyles();
  const location = useLocation();

  const renderNavItems = ({ items, pathname, depth }: IChildNavBar) => {
    return <List disablePadding>{items?.reduce((acc, curr) => renderChildRoutes({ acc, curr, pathname, depth }), [])}</List>;
  };

  const renderChildRoutes = ({ acc, curr, pathname, depth = 0 }: IChildRoutes) => {
    const key = curr.title + depth;

    if (curr.items) {
      const open = matchPath(pathname, {
        path: curr.href,
        exact: false,
      });

      acc.push(
        <NavBarItem
          key={`multi-${key}`}
          depth={depth}
          icon={curr.icon}
          open={Boolean(open)}
          title={curr.title}
          href={curr.href}
          label={curr.label}
          isExternalLink={curr.isExternalLink}
        >
          {renderNavItems({
            depth: depth + 1,
            pathname,
            items: curr.items,
          })}
        </NavBarItem>,
      );
    } else {
      acc.push(
        <NavBarItem
          key={`alone-${key}`}
          depth={depth}
          href={curr.href}
          icon={curr.icon}
          title={curr.title}
          label={curr.label}
          isExternalLink={curr.isExternalLink}
        />,
      );
    }
    return acc;
  };

  const renderNavbarCommon = (navbars: any) => {
    return (
      <>
        {navbars.map((nav: any) => {
          return (
            <List key={nav.subheader} subheader={<ListSubheader disableSticky>{nav.subheader}</ListSubheader>}>
              {renderNavItems({ items: nav.items, pathname: location.pathname })}
            </List>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={isDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.topIcon} style={{ backgroundColor: '#373737 !important' }}>
          <div className={classes.drawerHeader}>
            <Link to={PATH_NAME.ROOT} className={classes.navBar_link}>
              <img src="/assets/images/logo.jpg" alt="Logo" title="logo" />
              <div>ST ERP</div>
            </Link>
          </div>
          <Divider style={{ width: '100%', backgroundColor: '#f1416c' }} />
        </div>
        <div className={classes.menu}>{renderNavbarCommon(navBarCommon)}</div>
        <footer className={classes.footer}>
          <Divider style={{ backgroundColor: '#f1416c' }} />
          <h3>VERSION: 1.1.0</h3>
        </footer>
      </Drawer>
    </>
  );
}

export default memo(NavBar);
