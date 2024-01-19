import { makeStyles } from '@mui/styles';

const useCustomEnumStyles = makeStyles(() => ({
  root: {
    minWidth: '150px',
    // maxWidth: 250,
    width: '100%',
    minHeight: 38,
    // marginLeft: 20,
  },
  loadingIndicator: {
    '&.MuiMenuItem-root': {
      marginTop: 4,
      justifyContent: 'space-between',
      display: 'flex',
      alignItems: 'center',
    },
  },
  menuList: {
    '& li:not(:last-child)': {
      borderBottom: '1px solid #dddddd78',
      width: '100%',
      textOverflow: 'ellipsis',
      whiteSpace: 'inherit',
    },
  },
  flexBox: {
    '&.MuiFormControl-root': {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      // backgroundColor: '#fff',
    },
  },
  divBox: {
    padding: '10px',
    // border: '1px solid #f1416c',
    borderRadius: '5px',
    backgroundColor: '#fff',
  },
}));

export default useCustomEnumStyles;
