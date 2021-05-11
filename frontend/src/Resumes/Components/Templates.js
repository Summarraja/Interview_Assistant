import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import myClasses from "./../Components/Left/Left.module.css";
import thumbn from "../../assets/templateA.png";
import { Paper, Typography } from '@material-ui/core';
function Templates() {
  const useStyles = makeStyles({
    headerLink: {
      color: "#FF8E53 ",
      minWidth: 100,
      marginLeft: 30,
    },
  });

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
        {/* Placeholder for a second template */}
        {/* <div className={myClasses.templateCard}>
          <img src={thumbn} alt="thumbnail" className={myClasses.imgThumb} />
          <Button
            className={classes.headerLink}
            component={Link}
            to="/basic/header"
          >
            The Stylish
          </Button>
        </div> */}
      </div>
     
    </div>
    </Paper>
  );
}

  export default Templates;