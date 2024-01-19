// material core
import { createTheme } from '@material-ui/core/styles';
import light from './light';
import dark from './dark';
import typography from './typography';

const typeTheme = [light, dark];

const themes = (type: number) =>
  createTheme({
    ...typeTheme[type],
    typography: { ...typography },
  });

export default themes;
