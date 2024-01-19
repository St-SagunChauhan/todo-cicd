import { createTheme } from '@material-ui/core/styles';

const lightTheme = createTheme({
  palette: {
    type: 'light',
    common: {
      white: '#fff',
    },
    action: {
      active: '#333',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    primary: {
      light: '#1976d2',
      main: '#1976D2',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff4081',
      main: '#1976d2',
      dark: '#c51162',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
  overrides: {},
});

export default lightTheme;
