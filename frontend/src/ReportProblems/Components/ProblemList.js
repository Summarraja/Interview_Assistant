import { Paper, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ProblemListItems from "./ProblemListItems";
import AppBar from "@material-ui/core/AppBar";

import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "30px auto",
    padding: "20px 50px",
  },
}));

const ProblemList = (props) => {
  console.log(props.items)
  const classes = useStyles();

  const heading = {
    paddingTop: "16px",
    fontSize: "1.2rem",
  };
  if (props.items.length === 0) {
    return (
      <>
        <AppBar position="static">
          <Typography style={heading}>REPORTED PROBLEMS</Typography>
        </AppBar>
        <Container maxWidth="md" component="main">
          <Typography
            variant="h4"
            color="primary"
            align="center"
            style={{ padding: "20px 0px" }}
          >
            {"No Problems are reported by any user"}
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Typography style={heading}>REPORTED PROBLEMS</Typography>
      </AppBar>
      {props.items.map((problem) => (
        <ProblemListItems
          key={problem._id}
          id={problem._id}
          title={problem.title}
          answer={problem.answer}
          description={problem.description}
          setFaqs={props.setFaqs}
        />
      ))}
    </>
  );
};
export default ProblemList;
