import React, { Component } from 'react';
import * as ExcelJS from 'exceljs';
import deptService from 'services/dept.Request';
import { useDispatch, useSelector } from 'react-redux';
import { deptSelector } from 'selectors/dept.selector';
import { saveAs } from 'file-saver';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { teamLoggerSelector } from 'selectors/teamLogger.selector';
import teamLoggerServices from 'services/teamLogger.Request';

export const ExportToExcel = ({ userDetail, Dynamiccolumn }: any) => {
  const dispatch = useDispatch();

  const teamloggerData: any = useSelector(teamLoggerSelector);

  console.log('deptData', teamloggerData);

  // const deptName = teamloggerData?.map((el: any) => el.departmentName);

  // console.log('deptName', deptName);

  // React.useEffect(() => {
  //   dispatch(teamLoggerServices.exportTeamlogger());
  // }, []);

  const fileType = 'xlsx';

  const downloadtoExcel = async () => {
    let Headingfromcomponents = Dynamiccolumn?.map((i: any) => i.headerName);

    Headingfromcomponents = Headingfromcomponents.filter((item: string) => item !== 'Action');

    // const Department = teamloggerData?.map((item: any) => item.departmentName);

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
    saveAs(blob, 'Teamlogger.xlsx');
  };

  return (
    <button
      type="button"
      style={{
        backgroundColor: '#3e97ff',
        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
        color: 'white',
        padding: '6px 20px',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        borderRadius: '0.3rem',
        cursor: 'pointer',
        // marginTop: '5px',

        border: 'none',
        fontSize: '0.75rem',
        fontWeight: '500',
        marginLeft: '10px',
        marginTop: '10px',
        minWidth: '150px',
        minHeight: '55px',
        maxHeight: '60px',
      }}
      onClick={downloadtoExcel}
    >
      <ArrowDownwardIcon style={{ fontSize: '12px', marginRight: '5px' }} />
      DEMO-TEMPLATE
    </button>
  );
};
