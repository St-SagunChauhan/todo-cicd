import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
      height: '10px',
      overflow: 'scroll',
    },
  },
  virtualScroll: {
    fontSize: 14,
  },
}));

export default useStyles;
