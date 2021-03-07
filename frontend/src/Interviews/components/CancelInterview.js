import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import DialogContentText from "@material-ui/core/DialogContentText";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    variant: "h6",
    color: theme.palette.primary.main,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CancelInterview = (props) => {
  const classes = useStyles();

  // const CloseCancelDialogHandler = () => {
  //   props.setOpenCancelDialog(false);
  //   console.log(props.OpenCancelDialog);
  // };

  return (
    <Dialog
      open={props.OpenCancelDialog}
      onClose={props.CloseCancelDialogHandler}
      fullWidth
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
    >
      <DialogTitle
        onClose={props.CloseCancelDialogHandler}
        className={classes.dialogTitle}
      >
        Cancel Interview Confirmation
      </DialogTitle>
      <DialogContent dividers>
        <div className={classes.demo}>
          Are you sure you want to cancel this interview?
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.CloseCancelDialogHandler}
          variant="outlined"
          color="primary"
        >
          No
        </Button>
        <Button
          onClick={props.CloseCancelDialogHandler}
          variant="contained"
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelInterview;
