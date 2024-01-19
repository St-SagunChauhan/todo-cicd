import React, { useState, useEffect, useRef } from 'react';
import Box from '@material-ui/core/Box/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import useCustomSelectStyles from './CustomDateRangeStyle';

interface Props {
  onChange?: (value: Record<string, string>) => void;
  defaultValues?: Record<string, string>;
}

const CustomDateRange = ({ onChange, defaultValues }: Props) => {
  const classes = useCustomSelectStyles();
  const [startDates, setStartDate] = useState(defaultValues?.startDate || '');
  const [currentDates, setCurrentDate] = useState(defaultValues?.endDate || '');
  const [dateError, setDateError] = useState({ state: false, msg: '' });

  useEffect(() => {
    // Perform the validation whenever either start or end date changes
    if (startDates && currentDates) {
      // Trigger the onChange event only when both dates are selected
      onChange?.({ startDate: startDates, endDate: currentDates });
    }
  }, [startDates, currentDates]);

  const onChangeDate = (date: any, name: string) => {
    // Update the state when the date picker value changes
    if (date === null) {
      // Set the selected date to an empty string when cleared
      if (name === 'startDate') {
        setStartDate('');
      } else if (name === 'endDate') {
        setCurrentDate('');
      }
      // return;
    }

    if (name === 'startDate') {
      if (moment(date).format('YYYY-MM-DD') <= currentDates) {
        setDateError({ state: false, msg: '' });
        setStartDate(moment(date).format('YYYY-MM-DD'));
      } else if (currentDates === '') {
        setDateError({ state: false, msg: '' });
        setStartDate(moment(date).format('YYYY-MM-DD'));
      } else {
        setDateError({ state: true, msg: 'Start Date should be older then End Date' });
      }
    } else if (name === 'endDate') {
      if (startDates <= moment(date).format('YYYY-MM-DD')) {
        setDateError({ state: false, msg: '' });
        setCurrentDate(moment(date).format('YYYY-MM-DD'));
      } else if (startDates === '') {
        setDateError({ state: false, msg: '' });
        setCurrentDate(moment(date).format('YYYY-MM-DD'));
      } else {
        setDateError({ state: true, msg: 'Start Date should be older then End Date' });
      }
    }
  };

  return (
    <>
      <Box className={classes.divBox}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DatePicker
              label="Start Date"
              value={startDates || null}
              onChange={(value) => onChangeDate(value, 'startDate')}
              renderInput={(params: any) => <TextField size="small" variant="outlined" {...params} />}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="End Date"
              value={currentDates || null}
              onChange={(value) => onChangeDate(value, 'endDate')}
              renderInput={(params: any) => <TextField size="small" variant="outlined" {...params} />}
            />
          </Grid>
          <Grid xs={12}>
            {dateError.state ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block" style={{ color: 'red' }}>
                  {dateError.msg}
                </div>
              </div>
            ) : null}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CustomDateRange;
