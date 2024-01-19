import { Theme } from '@material-ui/core';
import { makeStyles } from '@mui/styles';

const useClientStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: 30,
  },
  loader: {
    width: '150px',
    position: 'absolute',
    left: '50%',
    top: '45%',
    height: '150px',
    textAlign: 'center',
  },
  submitClose: {
    display: 'flex',
    justifyContent: 'end',
    marginTop: 20,
    width: '100%',
  },
  closeBtn: {
    marginLeft: '20px',
  },
  menuPaper: {
    maxHeight: '300px !important',
    maxWidth: '100px !important',
  },
  labelError: {
    color: 'red',
  },
  submitBtn: {
    fontSize: '15px !important',
    padding: '7px 30px !important',
  },
  flexBox: {
    '&.MuiFormControl-root': {
      display: 'flex !important',
      alignItems: 'center',
      flexDirection: 'row',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiFormControl-root:not(:first-child)': {
      marginLeft: 20,
    },
  },
}));

export default useClientStyles;
