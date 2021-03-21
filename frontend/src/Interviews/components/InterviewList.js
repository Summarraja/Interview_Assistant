import React from "react";
import InterviewItems from "./InterviewItems";
import Container from "@material-ui/core/Container";

import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import bgInterview5 from "../../shared/components/UIElements/Images/bgInterview5.jpg";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  hero: {
    width: "100%",
    height: 400,
    marginTop: 0,
    backgroundImage: `linear-gradient(
        to bottom,
        rgba(0, 27.8, 46.7, 0.7),
        rgba(78, 120, 160, 0.7)
      ), url(${bgInterview5})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      height: 300,
      fontSize: "3em",
    },
  },
  paper: {
    margin: "30px auto",
    padding: "20px 50px",
  },
}));
const InterviewList = (props) => {
  const classes = useStyles();

  if (props.items.length === 0) {
    return (
      <Container maxWidth="md" component="main">
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h4" color="primary" align="center">
            No Interviews found. Maybe create one?
          </Typography>
        </Paper>
      </Container>
    );
  }
  const today = new Date();

  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const CurrentDate = new Date(date);


  return (
  
      <>
      {props.items.map(interview => (
        <InterviewItems
          key={interview.id}
          id={interview.id}
          title={interview.title}
          description={interview.description}
          date={interview.date}
          isCancelled={interview.isCancelled}
          field={interview.field}
          candidates={interview.candidates}
          sendRequests={interview.sendRequests}
          receiveRequests={interview.receiveRequests}
           
          status = {interview.isCancelled? "CANCELLED" : (new Date(interview.date) > CurrentDate  ? "PENDING" : "TAKEN")}
         
          creatorId={interview.creator}
        />
      ))}
</>
  );
};

export default InterviewList;
