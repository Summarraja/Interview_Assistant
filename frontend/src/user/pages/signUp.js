import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import SelectBox from "../components/SelectBox";
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
  username: yup.string()
  .required("This field is required")
  .email("Please enter valid username"),

  password: yup
    .string()
    .required("This field is required")
    .min(8, "Password must be atleast 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
      "Must contain One Number and One Special Case Character"
    ),

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

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState('');

  const signUpSubmitHandler = (values, props) => {
    try {
      console.log(values)
      console.log(country)
      // const formData = new FormData();
      // formData.append("firstname",values.);
      // formData.append("lastname",values.);
      // formData.append("country",values.);
      // formData.append("dob",values.);
      // formData.append("email",values.);
      // formData.append("contact",values.);
      // formData.append("password",values.);
      // formData.append("address",values.);
      // formData.append("gender",values.);
      // const responseData = await sendRequest(
      //   'http://localhosst:5000/api/user/signup',
      //   'POST',
      //   formData
      // );
    }
    catch (err) { }

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
  const GenderHandler = (e) => {
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
          //  validationSchema={validationSchema}
          >
            {(props) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
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
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lname"

                      helperText={
                        <ErrorMessage
                          name="lastName"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>

                    <SelectBox country={country} setCountry={setCountry}
                    fullWidth />


                  </Grid>



                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="date"
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




                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      multiline
                      id="Address"
                      label="Address"
                      name="address"
                      autoComplete="Address"
                      helperText={
                        <ErrorMessage
                          name="address"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                  </Grid>
{/* 
                  <Grid item xs={12} sm={6}>
                    <label required>Gender: </label>

                    <Field
                      variant="outlined"
                      fullWidth
                      multiline
                      id="Address"
                      label="Address"
                      name="address"
                      autoComplete="Address"
                      helperText={
                        <ErrorMessage
                          name="address"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                    <span>Male</span>


                    <span>Female</span>
                  </Grid> */}



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