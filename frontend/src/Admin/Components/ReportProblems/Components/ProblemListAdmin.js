import React from "react";
import ProblemListItemsAdmin from "./ProblemListItemsAdmin";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const ProblemListAdmin = (props) => {
  const heading = {
    paddingTop: "16px",
    fontSize: "1.2rem",
  };
  if (props.items.length === 0) {
    return (
      <>
        <AppBar position="static">
          <Typography style={heading}>
           REPORTED PROBLEMS
          </Typography>
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
        <ProblemListItemsAdmin
          key={problem._id}
          id={problem._id}
          title={problem.title}
          answer={problem.answer}
          description={problem.description}
          setproblems={props.setproblems}
        />
      ))}
    </>
  );
};
export default ProblemListAdmin;
