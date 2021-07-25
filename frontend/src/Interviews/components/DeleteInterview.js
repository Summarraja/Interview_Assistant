import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    variant: "h6",
    color: theme.palette.primary.main,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});


const DeleteInterview = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [success, setSuccess] = useState(false);
  const [responseStatus, setResponseStatus] = useState("");


  const clearSuccess = () => {
    setSuccess(false);
    props.setOpenDeleteDialog(false);
  };
  useEffect(() => {
    setSuccess(status === 200 || responseStatus === "Interview Deleted");
  }, [status, responseStatus]);

  const CloseDeleteDialogHandler = () => {
    props.setOpenDeleteDialog(false);
  };

  const confirmDeleteHandler = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/interviews/${props.selectedInterviewId}`,
        "DELETE",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      setResponseStatus(responseData.message)
      props.getData(auth.userId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
  <Snackbar
            open={success || !!error}
            autoHideDuration={6000}
            onClose={status === 200 ? clearSuccess : clearError}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              severity={status === 200 ? "success" : "error"}
              onClose={status === 200 ? clearSuccess : clearError}
            >
              {status === 200 && responseStatus === "Interview Deleted" ? "Interview Deleted Successfully!" : error}
            </MuiAlert>
          </Snackbar>

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
          Delete Interview Confirmation
        </DialogTitle>

        <DialogContent dividers>
          <div className={classes.demo}>
            Are you sure you want to delete this interview?
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
          {isLoading && <LoadingSpinner open={isLoading} />}

          <Button
            onClick={confirmDeleteHandler}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteInterview;
