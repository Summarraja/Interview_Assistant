import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";

const TimePicker = (props) => {
    const handleTimeChange = (e) => {
        props.setTime(e.target.value);
      };

    return (
        <TextField
        id="time"
        label="Set time"
        type="time"
        onChange = {handleTimeChange}
        defaultValue={props.time}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />
    

    );
};
export default TimePicker;
