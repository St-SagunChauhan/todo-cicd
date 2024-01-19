import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CustomAutocompleteStyles from './CustomAutocomplete.styles';

interface Option {
  label: string;
  value: string;
}

interface CustomAutocompleteProps {
  data: any[];
  value: any;
  onChange: any;
  name: string;
  label: string;
  default?: any[];
  fieldError: Boolean;
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({ data, onChange, value, label, fieldError }) => {
  const classes = CustomAutocompleteStyles();
  // console.log('dataatatatata: ', data, ':', value);
  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        limitTags={2}
        selectOnFocus
        filterSelectedOptions
        options={data?.length > 0 ? data : []}
        value={data?.length > 0 ? value : []}
        onChange={onChange}
        size="small"
        getOptionLabel={(option) => option?.label}
        getOptionSelected={(option, value) => option?.value === value?.value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={Boolean(fieldError)}
            variant="outlined"
            size="small"
            multiline
            maxRows={1}
            style={{ width: '100%', backgroundColor: '#fff', zIndex: '3000' }}
          />
        )}
      />
    </div>
  );
};

export default CustomAutocomplete;
