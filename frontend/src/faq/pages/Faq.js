import React from "react";
import "./Faq.css";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { makeStyles, fade } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { Fragment } from "react";
import FaqCollection from "../components/FaqCollection";

const useStyles = makeStyles((theme) => ({

  paper: {
    backgroundColor: "#4E78A0",
    [theme.breakpoints.up("xs")]: {
      margin: theme.spacing(3, 7),
      //  padding: theme.spacing(3),
      width: "auto",
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(3, 20),
      width: "auto",
    },
  },
  collapse: {
    width: "100%",
  },

  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 1),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.75),
    },
    width: "400px",
    height: "40px",
    margin: theme.spacing(0, 6),
    [theme.breakpoints.up("sm")]: {
     // margin: theme.spacing(0, 15),
      width: "auto",
    },
    [theme.breakpoints.up("md")]: {
    //  margin: theme.spacing(0, 25),
      width: "auto",
    },
    [theme.breakpoints.up("lg")]: {
      margin: theme.spacing(0, 40),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  },
  inputRoot: {
    color: "inherit",
    height: "100%",
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
      "&:focus": {
        width: "auto",
      },
    },
  },
}));


export default function FAQ(props) {
  const MainHeading = {
    color: "white",
    padding: "60px 20px 30px 20px",
    width: "100%"
  };


  const classes = useStyles();
  return (
<Fragment>
      <div className={classes.root}>
      <div className="TopHeader" >
        <Typography variant="h4" align="center" style={MainHeading}>
          How can we help you?
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Type keywords to find answers"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>

      </div>
     
      <Typography
        variant="h4"
        align="center"
        style={{ margin: "20px", color: "#004777" }}
      >
        Frequently Asked Questions
      </Typography>
      <Paper elevation={10} className={classes.paper}>
       <div className={classes.collapse}>
      <FaqCollection/>
      </div>
      </Paper>
      </div>
    </Fragment>
  );
}
