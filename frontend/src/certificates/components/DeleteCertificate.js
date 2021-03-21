import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
 
    dialogTitle: {
      variant: "h6",
      color: theme.palette.primary.main,
    },
    
  }));

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });
  

const DeleteCertificate = (props) => {
    const classes = useStyles();

    const CloseDeleteDialogHandler = () => {
      props.setOpenDeleteDialog(false);
      console.log(props.OpenDeleteDialog);
    };

  return (
    <Dialog
      onClose={CloseDeleteDialogHandler}
      open={props.OpenDeleteDialog}
      fullWidth
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
    >
      <DialogTitle
      onClose={CloseDeleteDialogHandler}
        className={classes.dialogTitle}
      >
        Remove Certificate Confirmation
      </DialogTitle>
      <DialogContent dividers>
        <div className={classes.demo}>
          Are you sure you want to remove this Certificate? You can no longer see this certificate in your profile!
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={CloseDeleteDialogHandler}
          variant="outlined"
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={CloseDeleteDialogHandler}
          variant="contained"
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
     
    </Dialog>
  );
};

export default DeleteCertificate;
