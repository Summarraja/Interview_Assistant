import React, { useEffect, useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { AuthContext } from "../../../shared/context/auth-context";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  GridStyle: {
    margin: " 0px 45px 0px 23px",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },
  InterviewFields: {
    marginTop: 7,
  },
  submit: {
    float: "right",
  },
}));


const validationSchema = yup.object().shape({
  question: yup
    .string()
    .min(10, "Question must be atleast 10 characters long")
    .required("Question is required"),
  answer: yup
    .string()
    .min(10, "Answer must be atleast 10 characters long")
    .required("Answer is required"),
}); 

const EditFaqs= (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [success, setSuccess] = useState(false);

  const clearSuccess = () => {
    setSuccess(false);
   
  };
  useEffect(() => {
    setSuccess(status === 200);
  }, [status]);

  const classes = useStyles();

  const initialValues = {
    question: props.loadedFaqs.question,
    answer: props.loadedFaqs.answer,
  };

  const onSubmitHandler = async (values) => {

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/faqs/${props.faqid}`,
        "PATCH",
        JSON.stringify({
          question: values.question,
          answer: values.answer,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
       
      ); 
      props.getData();
    } catch (err) {}
  };

  return (
  
    <>
     
     {isLoading && <LoadingSpinner open={isLoading} />}

            <Snackbar
              open={success|| !!error}
              autoHideDuration={6000}
              onClose={status === 200 ? clearSuccess : clearError}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                severity={status === 200 ? "success" : "error"}
                onClose={status === 200 ? clearSuccess : clearError}
              >
                {status === 200 ? "FAQ Updated Successfully!" : error}
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
              <Grid item={true} xs={12} sm={12}>
                <Grid item={true} xs={12}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="question"
                    label="Question"
                    name="question"
                    disabled={props.disableField}
                    helperText={
                      <ErrorMessage
                        name="question"
                        style={{ color: "red", fontWeight: "bold" }}
                      />
                    }
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <Field
                    as={TextField}
                    id="answer"
                    multiline
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="answer"
                    disabled={props.disableField}
                    label="Answer"
                    helperText={
                      <ErrorMessage
                        name="answer"
                        style={{ color: "red", fontWeight: "bold" }}
                      />
                    }
                  />
                </Grid>
                </Grid>
                </Grid>

            {/* {!props.disableField && props.hasEditAccess &&  ( */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  !(fProps.isValid || fProps.isSubmitting)
                }
                className={classes.submit}
              >
                Save Changes
              </Button>
            {/* )} */}
          </Form>
        )}
      </Formik>
    </>
  );
};
export default EditFaqs;
