import React from "react";
import { Link } from "react-router-dom";
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
import { Toolbar } from "@material-ui/core";

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
    width: "100%",
    marginTop: theme.spacing(2),
  },
}));

export default function ResetPassword() {
  const paperStyle = {
    width: 400,
    padding: 20,
    margin: "20px auto",
  };
  const avatarStyle = {
    backgroundColor: "#004777",
  };
  const initialValues = {
    username: "",
  };
  const ButtonStyle = {
    minWidth: "160px",
    minHeight: "40px",
    margin: "10px 8px ",
  };
  const validationSchema = yup.object().shape({
    NewPass: yup
      .string()
      .required("This field is required")
      .min(6, "Password must be atleast 6 characters long"),

    ConfirmPass: yup
      .string()
      .required("This field is required")
      .oneOf([yup.ref("NewPass"), null], "Passwords must match"),
  });


  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <Toolbar />
      <Paper elevation={10} style={paperStyle}>
        <Typography align="center" variant="h5">
          Reset Password?
        </Typography>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <VpnKeyIcon style={avatarStyle} />
          </Avatar>
          <Formik
            initialValues={initialValues}
            // onSubmit={onSubmitHandler}
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form className={classes.form}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  // type="password"
                  id="NewPass"
                  label="Enter new Password"
                  name="NewPass"
                  autoFocus
                  helperText={
                    <ErrorMessage
                      name="NewPass"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />

                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  id="ConfirmPass"
                  label="Confirm Password"
                  name="ConfirmPass"
                  autoFocus
                  helperText={
                    <ErrorMessage
                      name="ConfirmPass"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={ButtonStyle}
                  component={Link}
                  to="/Home"
                  disabled={!(props.isValid || props.isSubmitting)}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  style={ButtonStyle}
                  component={Link}
                  to="/forgotpassword"
                >
                  CANCEL
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        <Box mt={3}></Box>
      </Paper>
    </Container>
  );
}
