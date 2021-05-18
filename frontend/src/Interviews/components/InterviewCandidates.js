import React, { useState, useEffect, useContext } from "react";
import SearchBar from "material-ui-search-bar";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import SearchCandidates from "./SearchCandidates";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import CandidatesDialogItems from "./CandidatesDialogItems";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

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
    color: theme.palette.primary.main,
  },
}));

const CustomizedDialogs = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const [searchItem, setSearchItem] = useState("");
  const [resume, setResume] = useState([]);
  const [closeIcon, setCloseIcon] = useState(false);

  useEffect(() => {
    setResume("");
    setCloseIcon(false);
  }, [searchItem]);

  const handleCloseDialog = () => {
    props.setOpen(false);
    setSearchItem("");
    setCloseIcon(false);
  };

  const getSearchItem = () => {
    setCloseIcon(!closeIcon);
    const fetchSearchedResumes = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/resumes/resume/${searchItem}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setResume(responseData.resumes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSearchedResumes();
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
          Candidates
          <SearchCandidates
            setSearchItem={setSearchItem}
            searchItem={searchItem}
            getSearchItem={getSearchItem}
            closeIcon={closeIcon}
            setCloseIcon={setCloseIcon}
          />
        </DialogTitle>
        {isLoading && <LoadingSpinner open={isLoading} />}
        <DialogContent dividers>
          <div align="center">
            {!searchItem || !closeIcon
              ? props.candidateResume.length === 0
                ? "No Candidates have been added to this Interview. "
                : props.candidateResume.map((candidate) => (
                    <CandidatesDialogItems
                      key={candidate.id}
                      id={candidate.id}
                      name={candidate.fullname}
                      userId={candidate.user}
                      interId={props.interId}
                      interCandidates={props.interCandidates}
                      getInterviewRequestsData = {props.getInterviewRequestsData}
                       //  image={candidate.image}
                    />
                  ))
              : resume.length === 0
              ? "No users Found"
              : resume.map((resume) => (
                  <CandidatesDialogItems
                    key={resume._id}
                    id={resume._id}
                    name={resume.fullname}
                    interId={props.interId}
                    userId={resume.user}
                    searchItem={searchItem}
                    interCandidates={props.interCandidates}
                    interReceivedRequests = {props.interReceivedRequests}
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

export default CustomizedDialogs;
