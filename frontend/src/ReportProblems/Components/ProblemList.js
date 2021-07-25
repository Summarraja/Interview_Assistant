import {  Typography } from "@material-ui/core";
import React from "react";
import ProblemListItems from "./ProblemListItems";
import AppBar from "@material-ui/core/AppBar";

import Container from "@material-ui/core/Container";



const ProblemList = (props) => {

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
