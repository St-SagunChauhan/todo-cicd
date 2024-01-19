import { Theme } from '@material-ui/core';
import { makeStyles } from '@mui/styles';

export const assetCategoryStyle = makeStyles((theme: Theme) => ({
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
  submitClose: {
    display: 'flex',
    justifyContent: 'end',
    marginTop: 20,
    width: '100%',
  },
  closeBtn: {
    marginLeft: '20px',
  },
  submitBtn: {
    fontSize: '15px !important',
    padding: '7px 30px !important',
  },
}));
