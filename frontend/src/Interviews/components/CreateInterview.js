import React, { Fragment, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import DvrIcon from "@material-ui/icons/Dvr";
import Dialog from "@material-ui/core/Dialog";
import InterviewForm from "./InterviewForm";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        Smarthire
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Typography: {
    fontFamily: theme.typography.fontFamily,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },

}));

const CreateInterview = (props) => {
 

  var curr = new Date();
  curr.setDate(curr.getDate() + 3);
  var date = curr.toISOString().substr(0, 10);
  const [field, setField] = useState("Computer Science");
  const [doi, setDoi] = useState(date);
  const [timeOfInter, setTimeOfInter] = useState("12:00");

  const paperStyle = {
    width: 400,
    padding: 20,
    margin: "100px auto",
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const classes = useStyles();

  return (
    <Fragment>
      <Dialog
        open={props.open }
        onClose={props.handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
      
        <DialogTitle
          onClose={props.handleCloseDialog}
          disableTypography
        >
          <Typography variant="h4" align="center">Schedule Interview</Typography>
           
            
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <DvrIcon style={avatarStyle} />
            </Avatar>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.demo}>
            <InterviewForm 
             field={field}
             setField={setField}
             doi={doi}
             setDoi={setDoi}
             timeOfInter = {timeOfInter}
             setTimeOfInter = {setTimeOfInter}
             setOpen = {props.setOpen}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleCloseDialog} color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CreateInterview;
