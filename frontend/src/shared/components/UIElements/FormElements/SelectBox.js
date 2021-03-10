import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
    formControl: {
        width: '100%',
    },
    FormHelperText: {
        marginLeft: 15
    }
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



const ProfileForm = (props) => {
    const classes = useStyles();
    const handleSelect = event => {
        props.setValue(event.target.value);
    };
    const names = props.data;
  
    return (
        <FormControl className={classes.formControl}>
            <InputLabel

                id="handle" >{props.title}
            </InputLabel>
            <Select
                labelId="handle"
                id="handle"
                value={props.value}
                onChange={!props.disabled ? handleSelect : props.setValue(props.value)}
                MenuProps={MenuProps}
                disabled = {props.disabled}

            >
                {names.map((name) => (
                    <MenuItem key={name} value={name}   >
                        {name}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText className={classes.FormHelperText} >{(!props.value ) && "This field is required"}</FormHelperText>
        </FormControl>

    );
};
export default ProfileForm;
