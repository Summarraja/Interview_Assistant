import React, { useEffect, useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { AuthContext } from "../../../../shared/context/auth-context";
import { useHttpClient } from "../../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../../shared/components/UIElements/LoadingSpinner";



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
    title: yup
      .string()
      .min(10, "titlle must be atleast 10 characters long")
      .required("Title is required"),
    // answer: yup
    //   .string(),
      description: yup
      .string()
      .min(10, "description must be atleast 10 characters long")
      .required("description is required"),
  });

const EditProblemAdmin= (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [success, setSuccess] = useState(false);

  const clearSuccess = () => {
    setSuccess(false);
   
  };
  useEffect(() => {
    setSuccess(status == 200);
  }, [status]);

  const classes = useStyles();

  const initialValues = {
    title: props.loadedproblems.title,
    answer: props.loadedproblems.answer,
    description: props.loadedproblems.description,
  };

  const onSubmitHandler = async (values) => {
  console.log("props problem id is "+props.problemid)
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/problems/${props.problemid}`,
        "PATCH",
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
      props.getData();
    } catch (err) {}
  };

  return (
 
    <>
     
     {isLoading && <LoadingSpinner open={isLoading} />}

            <Snackbar
              open={success|| !!error}
              autoHideDuration={6000}
              onClose={status == "200" ? clearSuccess : clearError}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                severity={status == "200" ? "success" : "error"}
                onClose={status == "200" ? clearSuccess : clearError}
              >
                {status == "200" ? "Respond Problem Successfully!" : error}
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
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled
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

              <Grid item xs={12}>
                <Field 
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled
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
export default EditProblemAdmin;
