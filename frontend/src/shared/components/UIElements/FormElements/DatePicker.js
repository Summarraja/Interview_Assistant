import React from 'react';
import TextField from "@material-ui/core/TextField";

const DatePicker = (props) => {
    const handleDateChange = (e) => {
        props.setDate(e.target.value);
    }
    return (

        <TextField
        id="date"
        label={props.label}
        fullWidth
        type="date"
        defaultValue={props.date}
        onChange={!props.disabled ? handleDateChange : props.setDate(props.date)}
        InputLabelProps={{
          shrink: true,
        }}
        disabled={props.disabled}
      />

    );
};
export default DatePicker;
