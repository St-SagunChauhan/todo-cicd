// import { makeStyles } from '@mui/styles';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const CustomAutocompleteStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 'auto',
      minHeight: 38,
      maxHeight: 40,
      // width: ,
      backgroundColor: '#fff !important',
      '& > * + *': {
        margin: theme.spacing(3),
      },
    },
  }),
);

export default CustomAutocompleteStyles;
