import React from 'react';
import { Button, ButtonProps, makeStyles, Theme } from '@material-ui/core';

const styles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: '#3e97ff',
    color: theme.palette.common.white,
    textTransform: 'capitalize',
    padding: '6px 20px',
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    '&:hover': {
      backgroundColor: '#317BD1',
    },
    marginTop: '10px',
    minWidth: '150px',
    minHeight: '50px',
    maxHeight: '60px',
  },
}));

const PrimaryButton = (props: ButtonProps) => {
  const classes = styles();
  return (
    <Button className={classes.root} {...props}>
      {props.children}
    </Button>
  );
};

PrimaryButton.defaultProps = {
  size: 'medium',
  varient: 'contained',
};

export default PrimaryButton;
