import { Theme } from '@material-ui/core';
import { makeStyles } from '@mui/styles';

export const MasterReportStyle = makeStyles((theme: Theme) => ({
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
  doubleChart: {
    '& .MuiPaper-root': {
      height: '100%',
      padding: 15,
      borderRadius: 10,
    },
    '& .apexcharts-title-text': {
      fontWeight: 600,
      fontSize: '17px',
      fontFamily: 'Inter, Helvetica, "sans-serif" !important',
      letterSpacing: '0.2px',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));
