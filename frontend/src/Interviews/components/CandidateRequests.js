import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import CandidateRequestsDialogItems from "./CandidateRequestsDialogItems";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  search: {
    margin: theme.spacing(2),
  },
  dialogTitle: {
    variant: "h6",
    fontSize: "1.3rem",
    color: theme.palette.primary.main,
  },
}));

const CandidateRequests = (props) => {
  const { isLoading, } = useHttpClient();

  const handleCloseDialog = () => {
    props.setOpen(false);
  };
  const classes = useStyles();

  return (
    <div>
      <Dialog
        onClose={handleCloseDialog}
        open={props.open}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          onClose={handleCloseDialog}
          className={classes.dialogTitle}
      
        >
            Candidate Requests
        </DialogTitle>
        {isLoading && <LoadingSpinner open={isLoading} />}
        <DialogContent dividers>
          <div align="center">
            {props.receivedCandResume.length === 0
              ? "No received requests are found. "
              : props.receivedCandResume.map((candidate) => (
                  <CandidateRequestsDialogItems
                    key={candidate.id}
                    id={candidate.id}
                    name={candidate.fullname}
                    userId={candidate.user}
                    interId={props.interId}
                    getInterviewRequestsData = {props.getInterviewRequestsData}

                    //  image={candidate.image}
                  />
                ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CandidateRequests;
