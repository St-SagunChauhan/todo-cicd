import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import useCustomEnumStyles from './CustomEnumFilterStyle';

// Define a generic type for the enum
interface EnumSelectProps<T> {
  enumObject: T;
  value: string;
  onChange?: (e: any) => void;
  label?: string;
}

// Use the generic type in the component
function EnumSelect<T extends Record<string, string>>({ enumObject, onChange, value, label }: EnumSelectProps<T>) {
  const [selectedValue, setSelectedValue] = useState(value);
  const enumKeys = Object.keys(enumObject);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setSelectedValue(e.target.value);
    onChange?.(e);
  };

  const classes = useCustomEnumStyles();

  return (
    <FormControl className={classes.flexBox} size="small" variant="outlined">
      <div className={classes.divBox}>
        <InputLabel style={{ marginLeft: '10px', marginTop: '10px' }} id="demo-simple-select-label">
          {label}
        </InputLabel>
        <Select
          label={label}
          value={selectedValue} // Use selectedValue instead of value
          className={classes.root}
          onChange={handleChange}
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
          {enumKeys.map((key) => (
            <MenuItem key={key} value={enumObject[key]}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </div>
    </FormControl>
  );
}

export default EnumSelect;
