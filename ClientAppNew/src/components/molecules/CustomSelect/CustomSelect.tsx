import React, { useState } from 'react';
import { CircularProgress, FormControl, MenuItem, Select, FormLabel, InputLabel } from '@material-ui/core';
import useCustomSelectStyles from './CustomSelect.styles';

interface Props {
  id?: string;
  value: string;
  onChange?: (e: any) => void;
  options: any[];
  loading?: boolean;
  placeholder?: string;
  showAll?: boolean;
  label?: string;
  inputLabel?: string;
}

const CustomSelect = ({
  onChange,
  value,
  options,
  id,
  loading,
  inputLabel,
  placeholder = 'Select',
  label,
  showAll = true,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const classes = useCustomSelectStyles();

  const handleChange = (e: React.ChangeEvent<any>) => {
    setSelectedValue(e.target.value);
    onChange?.(e);
  };

  return (
    <FormControl className={classes.flexBox} size="small" variant="outlined">
      <div className={classes.divBox}>
        {/* <FormLabel>{label}</FormLabel> */}
        {/* <InputLabel id="demo-simple-select-label" style={{ margin: '-10px 0px 0px 12px' }}>
        {inputLabel}
      </InputLabel> */}
        <InputLabel style={{ marginLeft: '10px', marginTop: '10px' }} id="demo-simple-select-label">
          {label}
        </InputLabel>
        <Select
          id={id}
          label={label}
          labelId="demo-simple-select-label"
          onChange={handleChange}
          value={selectedValue}
          className={classes.root}
          MenuProps={{
            MenuListProps: {
              className: classes.menuList,
              style: {
                width: 250,
                maxHeight: 300,
              },
            },
            PaperProps: {
              style: {
                width: 250,
              },
            },
          }}
        >
          {showAll && <MenuItem value="all">Select</MenuItem>}
          {loading ? (
            <MenuItem className={classes.loadingIndicator}>
              Loading List...
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            options?.length &&
            options?.map((option, key: number) => {
              return (
                <MenuItem value={option?.value} key={key}>
                  {option?.label}
                </MenuItem>
              );
            })
          )}
        </Select>
      </div>
    </FormControl>
  );
};

CustomSelect.defaultProps = {
  id: 'Select',
};

export default CustomSelect;
