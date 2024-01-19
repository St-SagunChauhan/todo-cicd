import React, { Component } from 'react';
import { Button, ButtonProps, makeStyles, Theme } from '@material-ui/core';
import * as ExcelJS from 'exceljs';
import deptService from 'services/dept.Request';
import { useDispatch, useSelector } from 'react-redux';
import { deptSelector } from 'selectors/dept.selector';
import { saveAs } from 'file-saver';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { empSelector } from 'selectors/emp.selector';
import empService from 'services/emp.Request';
import { clientSelector } from 'selectors/client.selector';
import clientService from 'services/clientRequest';

export const ExportClient = ({ userDetail, Dynamiccolumn }: any) => {
  const dispatch = useDispatch();

  const clientData: any = useSelector(clientSelector);

  const empName = clientData?.map((el: any) => el.departmentName);

  React.useEffect(() => {
    dispatch(clientService.fetchClientList());
  }, []);

  const styles = makeStyles((theme: Theme) => ({
    root: {
      backgroundColor: '#3e97ff',
      color: theme.palette.common.white,
      border: '0px',
      borderRadius: '4px',
      textTransform: 'capitalize',
      padding: '6px 20px',
      boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
      '&:hover': {
        backgroundColor: '#317BD1',
      },
      cursor: 'pointer',
      marginLeft: '5px',
      marginRight: '5px',
      marginTop: '10px',
      minWidth: '150px',
      minHeight: '50px',
      maxHeight: '60px',
    },
  }));

  const classes = styles();

  const fileType = 'xlsx';

  const downloadtoExcel = async () => {
    let Headingfromcomponents = Dynamiccolumn?.map((i: any) => i.headerName);

    Headingfromcomponents = Headingfromcomponents.filter((item: string) => item !== 'Action');

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add data to the worksheet
    worksheet.addRow(Headingfromcomponents);
    // worksheet.addRow(Department);

    // Generate an XLSX file
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Save the file using FileSaver.js
    saveAs(blob, 'Client.xlsx');
  };

  return (
    <button type="button" className={classes.root} onClick={downloadtoExcel}>
      <span style={{ marginRight: '3px' }}>
        <ArrowDownwardIcon style={{ fontSize: '20px', transform: 'translate(0px, 5px)' }} />
      </span>
      <span style={{ fontSize: '15px' }}>Export-Client</span>
    </button>
  );
};
