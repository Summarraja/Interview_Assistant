import React, { Fragment } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ErrorIcon from '@material-ui/icons/Error';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import EditProblem from "./EidtProblem";



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

const UpdateProblem = (props) => {

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
      <Dialog open={props.open} fullWidth maxWidth="sm">
        <DialogTitle disableTypography>
          <Typography variant="h5" align="center">
            Edit Problems
          </Typography>

          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <ErrorIcon style={avatarStyle} />
            </Avatar>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.demo}>
            <EditProblem
            loadedFaqs={props.loadedFaqs}
            problemid={props.problemid}
            getData={props.getData}
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

export default UpdateProblem ;
