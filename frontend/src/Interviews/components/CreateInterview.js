import React, { Fragment, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import DvrIcon from "@material-ui/icons/Dvr";

import InterviewForm from './InterviewForm';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        Smarthire
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Typography: {
    fontFamily: theme.typography.fontFamily,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const CreateInterview = () => {
//   const {error } = useHttpClient();

//   const auth = useContext(AuthContext);

  const paperStyle = {
    width: 400,
    padding: 20,
    margin: "100px auto",
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const classes = useStyles();

  return (
    <Fragment>
     
        <Container component="main" maxWidth="md">
          <Paper elevation={10} style={paperStyle}>
            <Typography align="center" variant="h5">
              Schedule Interview
            </Typography>
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <DvrIcon style={avatarStyle} />
              </Avatar>
              <InterviewForm />
            </div>
            <Box mt={3}>
              <Copyright />
            </Box>
          </Paper>
        </Container>
    </Fragment>
  );
}

export default CreateInterview;