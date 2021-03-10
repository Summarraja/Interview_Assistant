import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import * as yup from "yup";
import SignupForm from '../components/SignupForm'
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router'
import { useHttpClient } from '../../shared/hooks/http-hook';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  contact: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("This field is required")
    .matches(/^[A-Za-z ]*$/, "Please enter valid name (Alphabets Only)")
    .min(3, "First Name must be atleast 3 characters"),

  lastName: yup
    .string()
    .required("This field is required")
    .matches(/^[A-Za-z ]*$/, "Please enter valid name (Alphabets Only)")
    .min(3, "Last Name must be atleast 3 characters"),
  email: yup.string()
    .required("This field is required")
    .email("Please enter valid username"),

  password: yup
    .string()
    .required("This field is required")
    .min(6, "Password must be atleast 6 characters long")
  // .matches(
  //   /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
  //   "Must contain One Number and One Special Case Character"
  // )
  ,
  address: yup
    .string()
    .required("This field is required"),

  confirmPassword: yup
    .string()
    .required("This field is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),

  contact: yup
    .string()
    .required("This field is required")
    .matches(
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      "Please enter valid Contact number"
    )
    .min(11),
});

export default function SignUp() {
  const auth = useContext(AuthContext);
  const { isLoading, error,status, sendRequest, clearError } = useHttpClient();
  const [gender, setGender] = useState("other");
  const [country, setCountry] = useState("Afghanistan");
  const [dob, setdob] = useState("1900-01-01");
  const [userEmail, setUserEmail] = useState('');

  const signUpSubmitHandler = async (values, props) => {
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/users/signup',
        'POST',
        JSON.stringify({
          firstname: values.firstName,
          lastname: values.lastName,
          country: country,
          dob: dob,
          email: values.email,
          phone: values.contact,
          password: values.password,
          address: values.address,
          gender: gender
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      setUserEmail(responseData.email)
    }
    catch (err) {
    }

  };


  const classes = useStyles();
  const paperStyle = {
    width: "100%",
    padding: 20,
    margin: "80px auto",
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };

  if (userEmail!=='') {
    return <Redirect 
    to={{
        pathname: "/verifycode",
        state: { email: userEmail }
      }}
    />;;
  }
  return (
    <Container component="main" maxWidth="sm">
      <LoadingSpinner open={isLoading} />
      <Snackbar open={error} autoHideDuration={6000} onClose={clearError}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={clearError}>
          {error}
        </MuiAlert>
      </Snackbar>
      <Paper elevation={10} style={paperStyle}>
        <Typography align="center" variant="h4">
          SmartHire
        </Typography>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon style={avatarStyle} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <SignupForm
            signUpSubmitHandler={signUpSubmitHandler}
            initialValues={initialValues}
            validationSchema={validationSchema}
            gender={gender}
            setGender={setGender}
            country={country}
            setCountry={setCountry}
            dob={dob}
            setdob={setdob}
          />
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/auth" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </div>

        <Copyright />

      </Paper>
    </Container>
  );
}