import React from "react";
// import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import InterviewList from "../components/InterviewList";
import bgInterview5 from "../../shared/components/UIElements/Images/bgInterview5.jpg";
import Box from "@material-ui/core/Box";
import { Paper } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import {Link} from "react-router-dom";

import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
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
    backgroundColor: "#d3d3d3",
  },
  button:{
    float: "right",
    marginBottom: 15,
  }
}));

const DUMMY_INTERVIEWS = [
  {
    id: "I1",
    title: "Interview for Hiring QA testing Team",
    description:
      "Team that ensures the quality of software or application being developed",
    date: new Date().toLocaleString(),
    isCancelled: false,
    field: null,
    candidates: null,
    sendRequests: null,
    receiveRequests: null,
    status: "TAKEN",
    creator: "u1",
  },
  {
    id: "I2",
    title: "Interview for Architecture designing of Systems",
    description: "building system and object designs of the system",
    date: new Date().toLocaleString(),
    isCancelled: true,
    field: null,
    candidates: null,
    sendRequests: null,
    receiveRequests: null,
    status: "CANCELLED",
    creator: "u1",
  },
  {
    id: "I3",
    title: "Interview for Teaching",
    description: "Teaching in University to high level Students",
    date: new Date().toLocaleString(),
    isCancelled: false,
    field: null,
    candidates: null,
    sendRequests: null,
    receiveRequests: null,
    status: "PENDING",
    creator: "u1",
  },
  {
    id: "I4",
    title: "Interview for Teaching",
    description: "Teaching in University to high level Students",
    date: new Date().toLocaleString(),
    isCancelled: false,
    field: null,
    candidates: null,
    sendRequests: null,
    receiveRequests: null,
    status: "PENDING",
    creator: "u1",
  },
];

const Interview = () => {
  const classes = useStyles();
  // const userId = useParams().userId;
  //const loadedInterviews = DUMMY_INTERVIEWS.filter(interview => interview.creator === userId);
  // const loadedInterviews = {DUMMY_INTERVIEWS}

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Box className={classes.hero}>
          <Box>Interviews</Box>
        </Box>
        <Container maxWidth="lg" component="main">
          <Paper elevation={5} className={classes.paper}>
          
              <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<AddIcon />}
              component = {Link}
              to="/interviews/new"
             
            >
              Create Interview
            </Button>
           
           
            <InterviewList items={DUMMY_INTERVIEWS} />
          </Paper>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Interview;
