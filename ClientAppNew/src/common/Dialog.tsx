import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

type IProps = {
  title?: string;
  dialogContent?: React.ReactNode;
  dialogActions?: React.ReactNode;
  open: boolean;
  onClose?: ((event: React.SyntheticEvent<Element, Event>) => void) | undefined;
};

export default function DialogModel({ title, open, dialogContent, dialogActions, onClose }: IProps) {
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>{dialogActions}</DialogActions>
      </Dialog>
    </div>
  );
}
