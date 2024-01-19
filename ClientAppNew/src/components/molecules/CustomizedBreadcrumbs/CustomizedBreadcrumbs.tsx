import * as React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import { Box } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import useBreadCrumbsStyles from './BreadcrumbsStyles';

// interface LinkRouterProps extends LinkProps {
//   to: string;
//   replace?: boolean;
// }

// function LinkRouter(props: LinkRouterProps) {
//   return <Link {...props} component={RouterLink as any} />;
// }

function Page() {
  const classes = useBreadCrumbsStyles();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs className={classes.root} aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
      <Chip component="a" href="/" label="Home" icon={<AiOutlineHome />} />
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join(' ')}`;
        const label = pathnames
          .slice(0, index + 1)
          .map((string) => string.replaceAll('-', ' '))
          .join(' ');

        return last ? (
          <Chip key={to} component="a" href={to} label={label} />
        ) : (
          <Chip key={to} component="a" href={to} label={label} />
        );
      })}
    </Breadcrumbs>
  );
}

function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
  event.preventDefault();
}

const CustomizedBreadcrumbs = () => {
  const classes = useBreadCrumbsStyles();
  return (
    <Box role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb" className={classes.root}>
        <Page />
      </Breadcrumbs>
    </Box>
  );
};

export default CustomizedBreadcrumbs;
