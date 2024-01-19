import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: 30,
  },
}));

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  data: ReactNode;
};

export default function AddEditModal({ isOpen, handleCloseDialog, data }: IProps) {
  // Contract name
  const [name, setName] = React.useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const classes = useStyles();

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={isOpen} aria-labelledby="max-width-dialog-title">
        <DialogTitle id="max-width-dialog-title">
          <Grid container wrap="nowrap" justifyContent="space-between">
            <Grid item xs={11} className={classes.title}>
              <Typography variant="h3"> Create Upwork User</Typography>
            </Grid>

            <Button onClick={handleCloseDialog}>
              <CloseIcon />
            </Button>
          </Grid>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth id="outlined-name" label="Name" value={name} onChange={handleChange} />
            </Grid>
          </Grid>
          <br />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
