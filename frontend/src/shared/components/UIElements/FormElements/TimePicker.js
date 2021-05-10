import React  from 'react';
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
        onChange = {!props.disabled? handleTimeChange : props.setTime(props.time)}
        defaultValue={props.time}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        disabled={props.disabled}
      />
    

    );
};
export default TimePicker;
