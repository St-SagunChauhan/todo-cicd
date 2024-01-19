import React from 'react';
import { Box } from '@material-ui/core';
import { GridToolbarColumnsButton, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import useCustomToolbarStyle from './CustomToolbarStyle';

const CustomToolbar = (props: any) => {
  const classes = useCustomToolbarStyle();
  return (
    <Box className={classes.mainBox}>
      <Box>
        <GridToolbarColumnsButton className={classes.filterRBtn} {...props} />
        <GridToolbarFilterButton className={classes.filterRBtn} {...props} />
      </Box>
      {/* <Box>
        <GridToolbarExport className={classes.filterBtn} {...props} />
      </Box> */}
    </Box>
  );
};

export default CustomToolbar;
