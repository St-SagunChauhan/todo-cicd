import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core';
import navBarBack from '../../../assets/images/nab_bar.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: `${process.env.REACT_APP_DRAWER_WIDTH}px`,
      flexShrink: 0,
      '& .MuiDivider-root': {
        background: theme.palette.background.default,
      },
    },
    drawerPaper: {
      width: `${process.env.REACT_APP_DRAWER_WIDTH}px`,
      paddingBottom: 50,
      backgroundColor: '#373737',
      // backgroundImage: 'linear-gradient(93deg, rgb(43, 88, 118) 0%, rgb(78, 67, 118) 100%)',
      boxShadow: 'rgb(70, 70, 70) 6px 0px 10px -6px!important',
      // borderRadius: 10,
      borderRight: 'none!important',
      margin: 0,
      padding: 10,
      '& button': {
        color: theme.palette.background.default,
      },
      '& .MuiListSubheader-root': {
        color: theme.palette.background.default,
      },
    },
    drawerHeader: {
      // position: 'fixed',
      // top: '0',
      // width: '13.4%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      fontSize: 20,
      color: theme.palette.background.default,
      '& img': {
        width: 36,
        height: 36,
        marginRight: 16,
      },
    },
    item: {
      display: 'block',
      paddingTop: 0,
      paddingBottom: 0,
    },
    itemLeaf: {
      display: 'flex',
      paddingTop: 0,
      paddingBottom: 0,
    },
    button: {
      color: theme.palette.background.default,
      padding: '10px 8px',
      justifyContent: 'flex-start',
      textTransform: 'none',
      letterSpacing: 0,
      width: '100%',
    },
    menu: {
      marginTop: '60px',
    },
    topIcon: {
      position: 'fixed',
      top: '0',
      width: '13.4%',
      backgroundColor: '#373737 !important',
      zIndex: 3,
    },
    buttonLeaf: {
      display: 'flex',
      color: theme.palette.background.default,
      padding: '10px 8px',
      justifyContent: 'flex-start',
      textTransform: 'none',
      letterSpacing: 0,
      width: '100%',
      fontWeight: 400,
      borderRadius: 10,
      margin: '6px 0',
      transition: '0.3s',
      // '&.depth-0': {
      //   '& $title': {
      //     fontWeight: theme.typography.fontWeightMedium,
      //   },
      // },
      '&:hover': {
        textDecoration: 'none',
        background: '#ebebeb33',
        transform: 'scale(1.04)',
      },
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(1),
    },
    title: {
      marginRight: 'auto',
      fontSize: '16px',
      fontWeight: 300,
      letterSpacing: '0.9px',
    },
    active: {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      '& $title': {
        fontWeight: theme.typography.fontWeightMedium,
      },
      '& $icon': {
        color: theme.palette.text.primary,
      },
      '&:hover': {
        background: lighten(theme.palette.background.default, 0.1),
      },
    },
    navBar_link: {
      color: theme.palette.background.default,
      display: 'flex',
      justifyContent: 'center',
      textDecoration: 'none',
      alignItems: 'center',
    },
    version: {
      fontSize: 12,
    },
    footer: {
      backgroundColor: '#373737',
      color: '#f1416c',
      position: 'fixed',
      bottom: '0',
      width: '13.4%',
    },
    header: {
      position: 'fixed',
      top: '0',
      width: '13.4%',
    },
  }),
);

export default useStyles;
