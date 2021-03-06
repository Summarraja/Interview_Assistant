import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";

const DatePicker = (props) => {
    const handleDateChange = (e) => {
        props.setDate(e.target.value);
      };

    return (

        <TextField
        id="date"
        label="Date of Birth"
        fullWidth
        type="date"
        onChange={handleDateChange}
        defaultValue={props.date}
        InputLabelProps={{
          shrink: true,
        }}
      />

    );
};
export default DatePicker;
