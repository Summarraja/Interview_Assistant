import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
const useStyles = makeStyles(theme => ({
    formControl: {
        width: '100%',
    },
    FormHelperText: {
        marginLeft: 15
    }
}));

const RadioButtons = (props) => {
    const classes = useStyles();
    const handleGenderChange = (e) => {
        props.setGender(e.target.value);
      };

    return (
        <FormControl className={classes.formControl}>
        <FormLabel component="legend">Gender</FormLabel>

        <RadioGroup aria-label="gender" name="gender1" value={props.gender} onChange={handleGenderChange}>
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <FormHelperText className={classes.FormHelperText} >{(!props.gender) && 'This field is required'}</FormHelperText>

      </FormControl>

    );
};
export default RadioButtons;
