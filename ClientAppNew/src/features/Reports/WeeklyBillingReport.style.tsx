import { Theme } from '@material-ui/core';
import { makeStyles } from '@mui/styles';

export const weeklyBillingReportStyle = makeStyles((theme: Theme) => ({
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
  labelError: {
    color: 'red',
  },
  btnSpace: {
    display: 'flex',
    columnGap: 5,
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
  leftFilter: {
    display: 'flex',
    alignItems: 'center',
    '&.MuiGrid-item': {
      padding: '0px !important',
    },
  },
  divBox: {
    padding: '8px',
    // border: '1px solid #f1416c',
    borderRadius: '5px',
    backgroundColor: '#fff',
  },
}));
