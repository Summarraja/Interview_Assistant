import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
//import "yup-phone";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/auth">
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
  password: "",
  confirmPassword: "",
};

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[A-Za-z ]*$/, "Please enter valid name (Alphabets Only)")
    .min(3, "First Name must be atleast 3 characters"),

  lastName: yup
    .string()
    .matches(/^[A-Za-z ]*$/, "Please enter valid name (Alphabets Only)")
    .min(3, "Last Name must be atleast 3 characters"),
  username: yup.string().email("Please enter valid username"),

  password: yup
  .string()
  .min(8, "Password must be atleast 8 characters long")
  .matches(
    /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
    "Must contain One Number and One Special Case Character"
  ),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),

  contact: yup
    .string()
    .matches(
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      "Please enter valid Contact number"
    )
    .length(11),
});

const signUpSubmitHandler = (values, props) => {
  console.log("Signup submit");
  console.log(values);
  window.location = '/verifyEmail'
  setTimeout(() => {
    props.resetForm();
    props.setSubmitting(false);
  }, 1000);
  console.log(props);
};

export default function SignUp() {
  const classes = useStyles();
  const paperStyle = {
    width: "100%",
    padding: 20,
    margin: "80px auto",
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const [gender, setGender] = useState("female");
  const GenderHandler = (e) => {
    console.log(e.target.value);
    setGender(e.target.value);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={10} style={paperStyle}>
        <Typography align="center" variant="h3">
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
          <Formik
            initialValues={initialValues}
            onSubmit={signUpSubmitHandler}
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form className={classes.form}>
                  {console.log(props)}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                      helperText={
                        <ErrorMessage
                          name="firstName"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lname"
                      autoFocus
                      helperText={
                        <ErrorMessage
                          name="lastName"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label required>Gender: </label>

                    <Radio
                      value="male"
                      checked={gender === "male"}
                      color="secondary"
                      onChange={GenderHandler}
                      align="center"
                    />
                    <span>Male</span>

                    <Radio
                      value="female"
                      checked={gender === "female"}
                      color="secondary"
                      onChange={GenderHandler}
                      align="center"
                    />
                    <span>Female</span>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="date"
                      required
                      label="Date of Birth"
                      fullWidth
                      type="date"
                      defaultValue="2021-01-01"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="username"
                      autoComplete="email"
                      helperText={
                        <ErrorMessage
                          name="username"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="contact"
                      label="Contact No"
                      id="contact"
                      autoComplete="contact"
                      helperText={
                        <ErrorMessage
                          name="contact"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      //  type="password"
                      id="password"
                      autoComplete="current-password"
                      helperText={
                        <ErrorMessage
                          name="password"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="password"
                      helperText={
                        <ErrorMessage
                          name="confirmPassword"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!(props.isValid || props.isSubmitting)}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
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