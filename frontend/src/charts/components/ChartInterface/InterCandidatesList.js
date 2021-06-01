import React, { useEffect, useState, useContext } from "react";
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
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  if (props.items.length === 0) {
    return (
      <>
        <LoadingSpinner open={isLoading} />
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h5" color="primary" align="center">
            No Candidates
          </Typography>
        </Paper>
      </>);
  }

  return (
    <>
      {
        props.items.map((candidate) => (
          <InterCandidatesItems
            key={candidate}
            id={candidate}
            selectedCand={props.selectedCand}
            setSelectedCand={props.setSelectedCand}
          />

        )) 
      }

    </>
  );
};

export default InterCandidatesList;
