import { alpha, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    backgroundColor: '#373737',
    // backgroundImage: 'linear-gradient(238deg, rgb(43, 88, 118) 0%, rgb(78, 67, 118) 100%)',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: 'calc(100% - 270px)',
    marginLeft: `${process.env.REACT_APP_DRAWER_WIDTH}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // borderRadius: 10,
    margin: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuLanguage: {
    color: '#fff',
  },
  menuProfile: {
    minWidth: 115,
  },
  topBar_setting: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  textRole: {
    padding: '6px 16px',
    marginBottom: 6,
    fontSize: '1rem',
  },
  positionFixed: {
    // borderRadius: 10,
    margin: 0,
    width: 'calc(100%)',
    // backgroundColor: 'linear-gradient( 44deg, #d8d3f9, rgb(88 150 189) 0%, #eadbe3 43%, #dce0f7 91.9% )',
    // background-image: linear-gradient(123deg, #d8d3f9, rgb(88 150 189) 25%, #eadbe3 71%, #dce0f7 87.9% );
  },
}));

export default useStyles;
