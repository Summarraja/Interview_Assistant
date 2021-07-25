import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import ProblemCollectionAdmin from "../Components/ProblemCollectionAdmin";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 250,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
  },

  button: {
    float: "right",
    marginBottom: 10,
  },

  paper: {
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1, 1),

      width: "auto",
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(3, 8),
      width: "auto",
    },
  },
  collapse: {
    width: "100%",
  },
}));

export default function ReportProblemAdmin() {
  const classes = useStyles();

  return (
    <>
      <Toolbar />
      <div className={classes.root}>
        <Paper elevation={10} className={classes.paper}>
          <div className={classes.collapse}>
            <ProblemCollectionAdmin />
          </div>
        </Paper>
      </div>
    </>
  );
}
