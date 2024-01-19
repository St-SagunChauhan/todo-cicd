import { makeStyles } from '@mui/styles';

const useCustomToolbarStyle = makeStyles(() => ({
  // root: {},
  mainBox: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    // background: 'rgba(118, 183, 246, 0.3)',
    background: '#373737',
    borderRadius: '5px 5px 0 0',
  },
  filterBtn: {
    // color: '#000!important',
    color: '#fff !important',
    backgroundColor: '#3e97ff !important',
    // margin: '5px !important',
    padding: '10px 20px!important',
    fontSize: '14px!important',
  },
  filterRBtn: {
    // color: '#000!important',
    color: '#fff !important',
    backgroundColor: '#f1416c !important',
    marginRight: '5px !important',
    padding: '10px 20px!important',
    fontSize: '14px!important',
  },
}));

export default useCustomToolbarStyle;
