import React, { useState , useContext, useEffect} from "react";
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
  const interviewId = props.selectedInterviewId
  const classes = useStyles();
  const [loadedInterview, setLoadedInterview] = useState();
  const [loadedField, setLoadedField] = useState();
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();


  // Request to get sepcific Interview Details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/${interviewId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedInterview(responseData.interview);
      } catch (err) {}
    };
    if (!loadedInterview) 
    fetchInterview();
  }, [loadedInterview]);

    // Request to get FieldTitle against FieldId from loadedInterviews
    useEffect(() => {
      const fetchField = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/fields/${loadedInterview.field}`,
            "GET",
            null,
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          setLoadedField(responseData.field);
        } catch (err) {}
      };
      if (!loadedField) 
      fetchField();
    }, [loadedField]);

  const CancelInterviewHandler = async() => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/interviews/${interviewId}`,
        "PATCH",
        JSON.stringify({
          title: loadedInterview.title,
          description: loadedInterview.description,
          fieldTitle: loadedField.title,
          date: loadedInterview.date,
          time: loadedInterview.time,
          isCancelled: true
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  }
  return (
 <>
    {isLoading && <LoadingSpinner open = {isLoading}/>}

    {loadedInterview && (
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
          {console.log(loadedInterview.isCancelled)}
          <Button
            onClick={CancelInterviewHandler}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    )}
  
    </>
  );
};

export default CancelInterview;
