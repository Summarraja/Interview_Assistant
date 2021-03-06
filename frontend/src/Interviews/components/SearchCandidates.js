import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
    padding: 10,
    width:"80%"
  },

  iconButton:{
      float: "right",
      marginTop: "3px"
  }
}));

 function SearchCandidates(props) {
 const classes = useStyles();

 const searchHandler = (e) =>{
    props.setSearchItem(e.target.value)
 }

const clearHandler = ()=>{
  props.setCloseIcon(false);
  props.setSearchItem("");
} 

  return (
    <Paper component="form">
  
      <InputBase
        className={classes.input}
        placeholder="Type something and click search icon"
        inputProps={{ 'aria-label': 'search google maps' }}
         onChange={searchHandler}
         value={props.searchItem}
      />
      {!props.closeIcon && props.searchItem ?
        <IconButton  className={classes.iconButton} aria-label="search" onClick={props.getSearchItem}>
        <SearchIcon />
      </IconButton> :
       <IconButton  className={classes.iconButton} aria-label="search" onClick={clearHandler}>
       <ClearIcon />
     </IconButton>
      }
     
    </Paper>

  );
}
export default SearchCandidates;