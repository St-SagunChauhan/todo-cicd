import React from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import useClientStyles from 'features/Client/client.styles';
import empService from 'services/emp.Request';
import { IEmployee } from './EmpModel';

type props = {
  employee: IEmployee | undefined;
  handleCloseDelete: () => void;
  setIsOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteEmployee({ employee, handleCloseDelete, setIsOpenDelete }: props) {
  const classes = useClientStyles();
  const dispatch = useDispatch();
  const deleteEmployeee = async (id: any) => {
    await empService.deleteEmployee(id);
    setIsOpenDelete(false);
    dispatch(empService.fetchEmpList());
  };

  return (
    <div>
      <Typography>Are you sure You want to delete</Typography>
      <div className={classes.submitClose}>
        <div onClick={() => deleteEmployeee(employee?.employeeId)}>
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
