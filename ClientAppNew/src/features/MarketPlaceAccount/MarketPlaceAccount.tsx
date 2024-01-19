import React, { useState } from 'react';
import { Box, Grid, Button, Paper } from '@material-ui/core';
import { DataGrid, GridAddIcon, GridColDef } from '@mui/x-data-grid/index';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2';
import DialogModel from 'common/Dialog';
import marketPlaceAccountService from 'services/marketPlaceAccount.Request';
import { marketPlaceAccountSelector, isLoadingSelector } from 'selectors/marketPlaceAccount';
import SecondayButton from 'components/molecules/Buttons/SecondayButton';
import CustomDataGrid from 'components/molecules/CustomDataGrid/CustomDataGrid';
import loadingImg from '../../assets/images/blue_loading.gif';
import AddMarketPlaceAccountModal from './AddMarketPlaceAccountModal';
import EditMarketPlaceAccountModel from './EditMarketPlaceAccountModal';
import { marketPlaceAccountStyles } from './marketPlaceAccount.style';

export default function MarketPlaceAccountList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const dispatch = useDispatch();
  const classes = marketPlaceAccountStyles();
  const marketPlaceAccountData = useSelector(marketPlaceAccountSelector);
  useSelector(isLoadingSelector);
  const loading: boolean = useSelector(isLoadingSelector);

  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setIsOpenEditModal(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  React.useEffect(() => {
    dispatch(marketPlaceAccountService.fetchMarketPlaceAccountList());
  }, [dispatch]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Upwork-ID',
      flex: 1,
      editable: true,
    },
    // {
    //   field: 'taxId',
    //   headerName: 'Tax Id',
    //   width: 250,
    //   editable: true,
    // },
    // {
    //   field: 'userName',
    //   headerName: 'Upwork User Name',
    //   width: 350,
    //   editable: true,
    // },
    // {
    //   field: 'address',
    //   headerName: 'Address',
    //   width: 250,
    //   editable: true,
    // },
    {
      field: 'accounts',
      headerName: 'Accounts',
      flex: 1,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Actions',
      description: 'Edit and Remove user',
      sortable: false,
      flex: 0.3,
      renderCell: (param: any) => {
        const onClickDelMPA = (): void => {
          const marketPlaceAccountid = param.row.id;
          Swal.fire({
            customClass: 'alertBottomRight',
            title: 'Are you sure?',
            text: 'You want to update the user status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await marketPlaceAccountService.deleteMarketPlaceAccount(marketPlaceAccountid);

              if (response.status === 400) {
                Swal.fire('Error', response.data.message, 'error');
              } else {
                Swal.fire(
                  response.data.success ? 'Success!' : 'Error',
                  response.data.message,
                  response.data.success ? 'success' : 'error',
                );
              }

              dispatch(marketPlaceAccountService.fetchMarketPlaceAccountList());
            }
          });
        };

        const onClickEditMarket = async (): Promise<void> => {
          const response = await marketPlaceAccountService.fetchMarketPlaceAccountById(param?.row.id);
          setIsOpenEditModal(true);
          setEditRow(response?.marketPlaceAccount);
        };

        return (
          <>
            <IconButton color="primary" aria-label="edit" size="medium" onClick={() => onClickEditMarket()}>
              <EditIcon />
            </IconButton>
            {/* <IconButton color="primary" ria-label="change-password" size="medium" onClick={() => onClickEditPass()}>
              <VpnKeyIcon />
            </IconButton> */}
            <IconButton color="secondary" ria-label="delete" size="medium" onClick={() => onClickDelMPA()}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <>
        <Grid container>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end', marginBottom: '15px' }}>
            <DialogModel
              open={isOpen}
              title="Add Upword User"
              dialogContent={
                <AddMarketPlaceAccountModal
                  handleCloseDialog={handleCloseDialog}
                  isOpen={isOpen}
                  marketPlaceAccountData={marketPlaceAccountData}
                />
              }
            />

            <SecondayButton startIcon={<GridAddIcon />} onClick={() => handleOpen()}>
              Add Upwork User
            </SecondayButton>
          </Grid>

          <Grid item xs={12}>
            {loading ? (
              <img className={classes.loader} src={loadingImg} alt="loding-img" />
            ) : (
              <>
                {marketPlaceAccountData && marketPlaceAccountData !== null && (
                  <CustomDataGrid
                    rows={marketPlaceAccountData || []}
                    columns={columns}
                    getRowId={(row) => row?.id}
                    loading={loading}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                  />
                )}
              </>
            )}
          </Grid>
        </Grid>
      </>
      {isOpenEditModal && (
        <DialogModel
          open={isOpenEditModal}
          title="Edit client"
          dialogContent={
            <EditMarketPlaceAccountModel data={editRow} handleCloseDialog={handleCloseDialog} isOpen={isOpenEditModal} />
          }
        />
      )}
    </div>
  );
}
