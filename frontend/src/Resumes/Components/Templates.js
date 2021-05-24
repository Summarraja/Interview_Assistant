import React, { useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import myClasses from "./../Components/Left/Left.module.css";
import { useHistory } from 'react-router-dom'
import { Paper, Typography } from '@material-ui/core';
function Templates() {
  const history = useHistory();

  const useStyles = makeStyles({
    headerLink: {
      color: "#FF8E53 ",
      minWidth: 100,
      marginLeft: 30,
    },
  });
useEffect(()=>{
  if(history)
  history.push({
    pathname: '/resume/basic/header',
  });
},[history])
  const classes = useStyles();

  return (
      <Paper style ={{marginTop:"55px"}}>
    <div className="left">
      <Typography variant="h5" style={{textAlign:"center"}}>Chose Templates</Typography>
      <div className={myClasses.cards}>
        <div className={myClasses.templateCard}>
          <Button
            className={classes.headerLink}
            component={Link}
            to="/resume/basic/header"
          >
            The Basic
          </Button>
        </div>
      </div>
     
    </div>
    </Paper>
  );
}

  export default Templates;