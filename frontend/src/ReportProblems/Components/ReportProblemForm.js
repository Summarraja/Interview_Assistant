import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  Typography: {
    fontFamily: theme.typography.fontFamily,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  GridStyle: {
    margin: "0px 22px",
  },
}));

const ReportProblemForm = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const theme = useTheme();
  const classes = useStyles();
  const [success, setSuccess] = useState(false);

  const clearSuccess = () => {
    setSuccess(false);
    // props.setOpen(false)
  };
  useEffect(() => {
    setSuccess(status==201);
  }, [status]);

  const initialValues = {
    title: "",
    answer: "",
    description:""
  };

  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .min(10, "titlle must be atleast 10 characters long")
      .required("Title is required"),
    answer: yup
      .string(),
      description: yup
      .string()
      .min(10, "description must be atleast 10 characters long")
      .required("description is required"),
  });

  const onSubmitHandler = async (values) => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/problems/",
        "POST",
        JSON.stringify({
          title: values.title,
          answer: values.answer, 
          description: values.description         
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  return (
    <>    
      <LoadingSpinner open={isLoading} />
      <Snackbar
        open={success || !!error}
        autoHideDuration={6000}
        onClose={status == "201" ? clearSuccess   : clearError}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={status == "201" ? "success" : "error"}
          onClose={status == "201" ? clearSuccess : clearError}
        >
          {status == "201" ? "Problem Reported Successfully!" : error}
        </MuiAlert>
      </Snackbar>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
      >
        {(fProps) => (
          <Form>
            <Grid container>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="title"
                  label="Problem title"
                  name="title"
                  helperText={
                    <ErrorMessage
                      name="title"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>
              {/* <Grid item xs={12}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  multiline
                  name="answer"
                  label="Answer"
                  id="answer"
                  autoComplete="description"
                  helperText={
                    <ErrorMessage
                      name="answer"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid> */}

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  multiline
                  name="description"
                  label="Description"
                  id="description"
                  autoComplete="description"
                  helperText={
                    <ErrorMessage
                      name="description"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>
</Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={
                !(
                  fProps.isValid ||
                  fProps.isSubmitting
                )
              }
              className={classes.submit}
            >
           Report Problem
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ReportProblemForm ;
