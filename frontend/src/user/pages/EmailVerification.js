import React, { useState } from "react";
import { Link } from 'react-router-dom'
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { Redirect } from 'react-router'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router';
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
  form: {
    width: "80%",
    margin: "0px 20px"
    
  },
  formControl: {
    width: "100%",
    marginTop : "5px"
  },
   ButtonStyle : {
    minWidth: "140px",
    minHeight: "40px",
    margin: "15px 10px ",
    [theme.breakpoints.down("xs")]:{
      minWidth: "100px",
      minHeight: "20px",
      margin: "15px 13px ",
    },
  }
}));

export default function ForgetPassword(props) {
  const history = useHistory();
 
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const paperStyle = {
    width: "80%",
   padding: 20,
    margin: "80px auto",
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const initialValues = {
    username: "",
  };
 

  const validationSchema = yup.object().shape({
    username: yup.string().email("Please enter valid username"),
  });
  const onSubmitHandler = async (values, props) => {
    setUserEmail(values.username);
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/users/sendCode',
        'POST',
        JSON.stringify({
          email: values.username,
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      if (responseData.status)
        setSuccess(true)
    }
    catch (err) {
    }

  };
  const classes = useStyles();
  if (success) {
    return <Redirect
      to={{
        pathname: "/verifycode",
        state: { email: userEmail }
      }}
    />
  }
  if (!props.location.state) {
    // history.push("/");
    return <Redirect
    to={{
      pathname: "/",
    }}
  />
  }
  return (
    <Container component="main" maxWidth="sm">
      <LoadingSpinner open={isLoading} />
      <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={clearError}>
          {error}
        </MuiAlert>
      </Snackbar>
      <Paper elevation={10} style={paperStyle}>
        <Typography align="center" variant="h5">
          {props.location.state.emailverification && (<>Verify Your Email?</>)}
          {props.location.state.forgotpassword && (<>Forgot Password?</>)}
        </Typography>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <VpnKeyIcon style={avatarStyle} />
          </Avatar>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmitHandler}
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form className={classes.form}>
                <Typography variant="body1" style={{ margin: "10px", textAlign: "center" }}>
                  Please enter your email address associated with your account to start verification process
                </Typography>
                <Field
                  as={TextField}
                  variant="outlined"
                  className={classes.formControl}
                  required
                  fullWidth
                  id="email"
                  label="Enter your Email Address"
                  name="username"
                  autoComplete="email"
                  autoFocus

                  helperText={
                    <ErrorMessage
                      name="username"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.ButtonStyle}
                  // component = {Link}
                  // to ="/Reset"
                 disabled={!(props.isValid || props.isSubmitting)}
                >
                  NEXT
                </Button>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                className={classes.ButtonStyle}
                  component={Link} to="/login"
                >
                  CANCEL
                </Button>
              </Form>
            )}
          </Formik>
        </div>

      </Paper>
    </Container>
  );
}