import React from 'react';
import { Button, ButtonProps, makeStyles, Theme } from '@material-ui/core';

const styles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: '#f1416c',
    color: theme.palette.common.white,
    textTransform: 'capitalize',
    padding: '6px 20px',
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    '&.Mui-disabled': {},
    '&:hover': {
      backgroundColor: '#CE375C',
    },
    marginTop: '10px',
    minWidth: '150px',
    minHeight: '50px',
    maxHeight: '60px',
  },
}));

const SecondayButton = (props: ButtonProps) => {
  const classes = styles();
  return (
    <Button className={classes.root} {...props}>
      {props.children}
    </Button>
  );
};

SecondayButton.defaultProps = {
  size: 'medium',
  varient: 'contained',
};

export default SecondayButton;
