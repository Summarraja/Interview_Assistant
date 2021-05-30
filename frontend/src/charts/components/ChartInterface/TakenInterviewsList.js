import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TakenInterviewItems from "./TakenInterviewItems";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "0px auto",
    padding: "20px 50px",
  },
}));

const TakenInterviewsList = (props) => {
  const classes = useStyles();

  if (props.items.length === 0) {
    return (
      <Container maxWidth="md" component="main">
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h4" color="primary" align="center">
            No Taken Interviews
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    props.items.map((interview) => (
    <TakenInterviewItems
      key={interview.id}
      id={interview.id}
      title={interview.title}
      description={interview.description}
      date={interview.date}
      isCancelled={interview.isCancelled}
      field={interview.field}
      candidates={interview.candidates}
      creatorId={interview.creator}
      selectedInterview={props.selectedInterview} 
      setSelectedInterview={props.setSelectedInterview}
      setCandidates = {props.setCandidates}
      
    />

  ))
  );
};

export default TakenInterviewsList;
