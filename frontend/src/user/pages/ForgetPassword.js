import React from "react";
import { Link } from 'react-router-dom'
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";


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
    margin:"0px 20px"
  
  },
  formControl:{
   width: "100%",
 
  }
}));

export default function ForgetPassword() {
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
  const ButtonStyle = {
    minWidth: "140px",
    minHeight: "40px",
    margin: "20px 8px ",
  };
  const validationSchema = yup.object().shape({
    username: yup.string().email("Please enter valid username"),
  });
  const onSubmitHandler = (values, props) => {
    console.log("Has been submitted");
    console.log(values);
    window.location = '/verifyEmail';
  setTimeout(() => {
     props.resetForm();
   props.setSubmitting(false);
     }, 1000);
   console.log(props);
    };
  const classes = useStyles();
  
  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={10} style={paperStyle}>
        <Typography align="center" variant="h5">
          Forgot Your Password?
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
              <Form  className={classes.form}>
                {console.log(props)}
                <Typography  variant="body1" style={{margin: "10px", textAlign: "center"}}>
                  Please enter your username associated with your account to start password recovery process
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
                  style={ButtonStyle}
                 // onSubmit = {onSubmitHandler}
                  disabled= {!(props.isValid || props.isSubmitting)}
                >
                  NEXT
                </Button>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  style={ButtonStyle}
                  component={Link} to="/login"
                >
                  CANCEL
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        {/* <Box mt={3}></Box> */}
      </Paper>
    </Container>
  );
}