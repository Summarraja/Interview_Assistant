import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ListAltIcon from "@material-ui/icons/ListAlt";
import InterviewDetails from "../components/InterviewDetails";

const useStyles = makeStyles((theme) => ({
  GridStyle: {
    margin: " 0px 45px 0px 23px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  InterviewFields: {
    marginTop: 7,
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const ViewInterview = (props) => {
  const paperStyle = {
    width: "100%",
    padding: 20,
    margin: "80px auto",
    
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={10} style={paperStyle}>
        <Typography align="center" variant="h4">
          Interview Details
        </Typography>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ListAltIcon style={avatarStyle} />
          </Avatar>
        </div>
        <InterviewDetails />
        <Box mt={4}></Box>
      </Paper>
    </Container>
  );
};

export default ViewInterview;
