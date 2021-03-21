import React, { useEffect, useState, useContext } from "react";
import SelectBox from "../../shared/components/UIElements/FormElements/SelectBox";
import DatePicker from "../../shared/components/UIElements/FormElements/DatePicker";
import TimePicker from "../../shared/components/UIElements/FormElements/TimePicker";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { AuthContext } from "../../shared/context/auth-context";

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

const fields = [
  "Computer Science",
  "Electrical Engineering",
  "Material Engineering",
  "Chemical Engineering",
  "MBBS",
  "BDS",
  "Software Engineering",
];

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .min(5, "Title must be atleast 5 characters long")
    .required("Title is required"),
  description: yup
    .string()
    .min(15, "Description must be atleast 15 characters long")
    .required("Description is required"),
});

const UpdateInterview = (props) => {
  const interviewId = props.interId;
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [field, setField] = useState(props.loadedField.title);
  const [doi, setDoi] = useState(props.loadedInterview.date);
  const [time, setTime] = useState(props.loadedInterview.time);
  const [success, setSuccess] = useState(false);

  const clearSuccess = () => {
    setSuccess(false);
    props.setOpen(false);
  };
  useEffect(() => {
    setSuccess(status == 201);
  }, [status]);

  const classes = useStyles();
  const today = new Date();
  const CurrentDate = new Date(
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  );

  const initialValues = {
    title: props.loadedInterview.title,
    description: props.loadedInterview.description,
  };

  const onSubmitHandler = async (values) => {
    console.log(values.title);
    console.log(values.description);
    console.log(field);
    console.log(doi);
    console.log(time);
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/interviews/${interviewId}`,
        "PATCH",
        JSON.stringify({
          title: values.title,
          description: values.description,
          fieldTitle: field,
          date: props.doi,
          time: props.timeOfInter,
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
      >
        {(fProps) => (
          <Form>
            {isLoading && <LoadingSpinner open={isLoading} />}
            <Snackbar
              open={success || !!error}
              autoHideDuration={6000}
              onClose={status == "201" ? clearSuccess : clearError}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                severity={status == "201" ? "success" : "error"}
                onClose={status == "201" ? clearSuccess : clearError}
              >
                {status == "201" ? "Interview Updated Successfully!" : error}
              </MuiAlert>
            </Snackbar>

            <Grid container>
              <Grid item={true} xs={12} sm={12}>
                <Grid item={true} xs={12}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    defaultValue={props.loadedInterview.title}
                    disabled={props.disableField}
                    helperText={
                      <ErrorMessage
                        name="title"
                        style={{ color: "red", fontWeight: "bold" }}
                      />
                    }
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <Field
                    as={TextField}
                    id="description"
                    multiline
                    defaultValue={props.loadedInterview.description}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="description"
                    disabled={props.disableField}
                    label="Description"
                    helperText={
                      <ErrorMessage
                        name="description"
                        style={{ color: "red", fontWeight: "bold" }}
                      />
                    }
                  />
                </Grid>
                <Grid
                  container
                  item={true}
                  xs={12}
                  className={classes.InterviewFields}
                >
                  <Grid item={true} xs={12} sm={4}>
                    <FormControl style={{ paddingLeft: "10px" }}>
                      <SelectBox
                        value={field}
                        setValue={setField}
                        title={"Select Field "}
                        data={fields}
                        fullWidth
                        disabled={props.disableField}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} xs={5} sm={3} className={classes.GridStyle}>
                    <FormControl>
                      <DatePicker
                        date={doi}
                        setDate={setDoi}
                        label="Set Interview Date"
                        disabled={props.disableField}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item={true} xs={5} sm={3}>
                    <TimePicker
                      time={time}
                      setTime={setTime}
                      disabled={props.disableField}
                    />
                  </Grid>
                </Grid>

                <Grid item={true} xs={12}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="status"
                    value={
                      props.loadedInterview.isCancelled
                        ? "CANCELLED"
                        : new Date(props.loadedInterview.date) > CurrentDate
                        ? "PENDING"
                        : "TAKEN"
                    }
                    disabled
                    size="small"
                    label="Status"
                    id="status"
                  />
                </Grid>
              </Grid>
              {/* <Grid item xs={6}></Grid> */}
            </Grid>

            {!props.disableField && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  !(fProps.isValid || !field || !doi || fProps.isSubmitting)
                }
                className={classes.submit}
              >
                Save Changes
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
export default UpdateInterview;
