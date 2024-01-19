import { Theme } from '@material-ui/core';
import { makeStyles } from '@mui/styles';

export const useEmpStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginTop: 10,
    marginLeft: 1,
    marginRight: 1,
    width: 250,
  },
  loader: {
    width: '150px',
    position: 'absolute',
    left: '50%',
    top: '45%',
    height: '150px',
    textAlign: 'center',
  },
  wrapper: {
    padding: 30,
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
  submitBtn: {
    fontSize: '15px !important',
    padding: '7px 30px !important',
  },
  uploadImg: {
    border: '1px solid #c1c2c2',
    borderRadius: 4,
  },
  uploadBtn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between !important',
    padding: '16px !important',
  },
  iconLabel: {
    display: 'flex',
    textTransform: 'capitalize',
  },
  profileImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));
