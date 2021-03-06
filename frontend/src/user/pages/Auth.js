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
import { AuthContext } from '../../shared/context/auth-context';
import AuthForm from '../components/AuthForm';


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

const SignIn = () => {

  const auth = useContext(AuthContext);

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
      {!auth.isLoggedIn && (
        <Container component="main" maxWidth="xs">
          <Paper elevation={10} style={paperStyle}>
            <Typography align="center" variant="h3">
              SmartHire
            </Typography>
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <ExitToAppIcon style={avatarStyle} />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
             </Typography>
              <AuthForm />
              <Grid container>
                <Grid item xs>
                  <Link href="/forgot" variant="body2">
                    Forgot password?
               </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}

                  </Link>
                </Grid>
              </Grid>
            </div>
            <Box mt={3}>
              <Copyright />
            </Box>
          </Paper>
        </Container>
      )}

    </Fragment>
  );
}

export default SignIn;