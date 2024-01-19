import React from 'react';
import clientService from 'services/clientRequest';
import { useDispatch } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import { Clients } from './ClientModel';
import useClientStyles from './client.styles';

type props = {
  client: Clients | undefined;
  handleCloseDelete: () => void;
  setIsOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteClient({ client, handleCloseDelete, setIsOpenDelete }: props) {
  const classes = useClientStyles();
  const dispatch = useDispatch();
  const deleteClient = async (id: any) => {
    await clientService.deleteClient(id);
    setIsOpenDelete(false);
    dispatch(clientService.fetchClientList());
  };

  return (
    <div>
      <Typography>Are you sure You want to delete</Typography>
      <div className={classes.submitClose}>
        <div onClick={() => deleteClient(client?.clientId)}>
          <Button color="primary" variant="contained" type="submit">
            Delete
          </Button>
        </div>
        <div className={classes.closeBtn}>
          <Button color="primary" variant="contained" onClick={() => handleCloseDelete()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
