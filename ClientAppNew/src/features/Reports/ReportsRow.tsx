import { Box, Collapse, IconButton, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { ReactNode } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

interface Props {
  rowData: any[];
  columns: GridColDef[];
  heading: string;
  innerTableHeading?: string;
  additionalCells?: ReactNode;
}

const ReportsRow = ({ rowData, columns, heading, innerTableHeading, additionalCells }: Props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow style={{ backgroundColor: '#77b7f64d', fontWeight: '1000' }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {heading}
        </TableCell>
        {additionalCells}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box style={{ height: 400, width: '100%', margin: 2, marginBottom: 4 }}>
              {innerTableHeading && (
                <Typography variant="h6" gutterBottom component="div">
                  {innerTableHeading}
                </Typography>
              )}
              <DataGrid
                rows={rowData}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection={false}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ReportsRow;
