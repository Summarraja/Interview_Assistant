import React, {useEffect, useState, useContext} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import InterCandidatesItems from "./InterCandidatesItems";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";


const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "0px auto",
    padding: "10px 20px",
  },
}));

const InterCandidatesList = (props) => {
  const classes = useStyles();
  const [candidateResume, setCandidateResume] = useState([]);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    setCandidateResume([]);
    const fetchCandidateResume = async (candID) => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/resumes/user/${candID}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
          console.log('yes')
        setCandidateResume((oldArray) => [...oldArray, responseData.resume]);
      } catch (err) {
        console.log(err);
      }
    };

  if(props.items.length !== 0){
    props.items.map((candID) =>
    fetchCandidateResume(candID)
  );
  }
 
  }, [props.items]);

  if (props.items.length === 0) {
    return (
        <>
        <LoadingSpinner open = {isLoading}/>
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h5" color="primary" align="center">
            No Candidates 
          </Typography>
        </Paper>
 </>   );
  }

  return (
      <>
      {!isLoading && candidateResume ?
    candidateResume.map((candidate) => (
    <InterCandidatesItems
      key = {candidate.id}
      id = {candidate.id}
      name = {candidate.fullname}
      image = {candidate.image}
      selectedCand = {props.selectedCand}
      setSelectedCand = {props.setSelectedCand}
    />

  )):<LoadingSpinner open = {isLoading}/>
    }
    
    </>
  );
};

export default InterCandidatesList;
