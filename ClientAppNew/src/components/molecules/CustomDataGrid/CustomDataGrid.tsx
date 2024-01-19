import React from 'react';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { Box } from '@material-ui/core';
import useCustomDataGridStyles from './CustomDataGridStyles';
import CustomNoRowsOverlay from './CustomNoRowsOverlay/CustomNoRowsOverlay';
import CustomToolbar from './CustomToolbar/CustomToolbar';
import CustomLoadingOverlay from './CustomLoadingOverlay/CustomLoadingOverlay';

const CustomDataGrid = (props: DataGridProps) => {
  const classes = useCustomDataGridStyles();

  return (
    <Box className={classes.dropBack} style={{ height: '70vh', width: '100%' }}>
      <DataGrid
        {...props}
        pageSize={10}
        disableColumnMenu
        disableSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        rowsPerPageOptions={[10]}
        checkboxSelection={false}
        density="comfortable"
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
          Toolbar: CustomToolbar,
          LoadingOverlay: CustomLoadingOverlay,
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
};

export default CustomDataGrid;
