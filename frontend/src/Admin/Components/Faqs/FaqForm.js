import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

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

const FaqForm = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const theme = useTheme();
  const classes = useStyles();
  const [success, setSuccess] = useState(false);

  const clearSuccess = () => {
    setSuccess(false);
    props.setOpen(false)
  };
  useEffect(() => {
    setSuccess(status==201);
  }, [status]);

  const initialValues = {
    question: "",
    answer: "",
  };

  const validationSchema = yup.object().shape({
    question: yup
      .string()
      .min(10, "Question must be atleast 5 characters long")
      .required("Title is required"),
    answer: yup
      .string()
      .min(10, "Answer must be atleast 15 characters long")
      .required("Answer is required"),
  });

  const onSubmitHandler = async (values) => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/faqs/",
        "POST",
        JSON.stringify({
          question: values.question,
          answer: values.answer,          
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
          {status == "201" ? "FAQ added Successfully!" : error}
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
                  id="question"
                  label="Question"
                  name="question"
                  helperText={
                    <ErrorMessage
                      name="question"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
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
            Add FAQ
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FaqForm ;
