import React, { FC, ReactNode } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  content: ReactNode;
  actions?: ReactNode;
  showCloseIcon?: boolean;
}

const useStyles = makeStyles<Theme>((theme) => ({
  paper: {
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'middle',
  },
  header: {
    // backgroundImage: 'linear-gradient(93deg, rgb(43, 88, 118) 0%, rgb(78, 67, 118) 100%)',
    backgroundColor: '#f1416c',
    color: '#fff',
    '& .MuiTypography-root': {
      display: 'flex',
      justifyContent: 'space-between', // Align the close icon to the right
      alignItems: 'center',
    },
  },
  dialogContent: {
    padding: '20px',
    minWidth: 500, // Set the minimum width to 500px
    minHeight: 150, // Set the minimum height to 400px
  },
  actionsContainer: {
    borderTop: `1px solid ${theme.palette.divider}`, // Add a border above the actions
    padding: theme.spacing(2), // Add padding to the actions container
  },
  closeIcon: {
    cursor: 'pointer',
    marginRight: theme.spacing(1),
  },
}));

const defaultProps: Partial<Props> = {
  showCloseIcon: true, // Set the default value for showCloseIcon to true
};

const CustomDialog: FC<Props> = ({ open, onClose, title, content, actions, showCloseIcon }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle className={classes.header}>
        {title}
        {showCloseIcon && <CloseIcon className={classes.closeIcon} onClick={onClose} />}
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>{content}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

CustomDialog.defaultProps = defaultProps;

export default CustomDialog;
