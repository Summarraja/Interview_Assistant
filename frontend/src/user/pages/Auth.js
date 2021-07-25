import React, { Fragment, useContext, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { AuthContext } from '../../shared/context/auth-context';
import AuthForm from '../components/AuthForm';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { useMemo } from "react";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link style={{ textDecoration: 'none', color: 'inherit' }} to={{
        pathname: "/",
      }}>
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
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [rememberme, setRememberme] = useState(false);

  const auth = useContext(AuthContext);
  const initialValues = useMemo(() => {
    return {
      username: "",
      password: "",
    }
  }, [])
  useEffect(() => {
    if (localStorage.checkbox === "true") {
      setRememberme(true);
      initialValues.username = localStorage.username;
      initialValues.password = localStorage.password;
    } else {
      setRememberme(false);
    }
  }, [initialValues]);
  const paperStyle = {
    width: "80%",
    padding: 20,
    margin: "120px auto"
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const classes = useStyles();
  const onSubmitHandler = async (values) => {
    if (rememberme) {
      localStorage.username = values.username;
      localStorage.password = values.password;
      localStorage.checkbox = "true";
    } else {
      localStorage.username = "";
      localStorage.password = "";
      localStorage.checkbox = "false";
    }
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/users/login`,
        'POST',
        JSON.stringify({
          email: values.username,
          password: values.password
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      auth.login(responseData.userId, responseData.token, responseData.resume, responseData.setting);
    } catch (err) {
      console.log(err)
    }

  };
  if (error === 'Email_not_verified') {

    return <Redirect
      to={{
        pathname: "/verifyEmail",
        state: {
          emailverification: true,
          forgotpassword: false
        }
      }} />;
  }
  return (
    <Fragment>
      <LoadingSpinner open={isLoading} />
      {status !== 401 && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
          <MuiAlert elevation={6} variant="filled" severity="error" onClose={clearError}>
            {error}
          </MuiAlert>
        </Snackbar>
      )}
      {!auth.isLoggedIn && (
        <Container component="main" maxWidth="sm" style={{ padding: "0px" }}>
          <Paper elevation={10} style={paperStyle}>
            <Typography align="center" variant="h4">
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
              <AuthForm
                setRememberme={setRememberme}
                rememberme={rememberme}
                onSubmitHandler={onSubmitHandler}
                error={error}
                status={status}
                initialValues={initialValues}
              />
              <Grid container>
                <Grid item xs>
                  <Link
                    style={{ textDecoration: 'none', }}
                    to={{
                      pathname: "/forgotpassword",
                      state: { forgotpassword: true }
                    }} variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    style={{ textDecoration: 'none', }}
                    to={{
                      pathname: "/signup",
                    }} variant="body2">
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