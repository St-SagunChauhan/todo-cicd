import { Theme } from '@material-ui/core';
import { makeStyles } from '@mui/styles';

export const eodReportStyle = makeStyles((theme: Theme) => ({
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
  labelError: {
    color: 'red',
  },
  closeBtn: {
    marginLeft: '20px',
  },
  submitClose: {
    display: 'flex',
    justifyContent: 'end',
    marginTop: 20,
    width: '100%',
  },
  submitBtn: {
    fontSize: '15px !important',
    padding: '7px 30px !important',
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customInputHeight: {
    minHeight: '210px',
    '& textarea': {
      minHeight: '210px',
    },
  },
}));
