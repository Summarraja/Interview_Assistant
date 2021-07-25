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
import { BiSave } from "react-icons/bi";
import { FiCheckSquare } from "react-icons/fi";
import Typography from "@material-ui/core/Typography";
import {
  BsBoxArrowInUpLeft,
  BsPersonCheckFill,
  BsPersonPlusFill,
} from "react-icons/bs";

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
    textAlign: "center",

    marginTop: 10,
  },
  statusStyle: {
    background: "#4E78A0",
    fontSize: "1rem",
    color: "#fff",
    // textAlign: "center",
    height: "35px",
    // marginTop: "12px ",
    padding: "5px",
    // alignContent: "center",
    width: "100%",
    textAlign: "center",
    borderRadius: 4,
  //  margin: "0px 80px",
    [theme.breakpoints.down("xs")]: {
      float: "right"
    },
  },
  statusIconStyle: {
    marginRight: "7px",
    transform: "translate(1px, 3px)",
    fontSize: "1rem",
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

  function onCandidateSentRequest(arr1, arr2) {
    return arr1.some((item) => arr2 === item._id);
  }

  const clearSuccess = () => {
    setSuccess(false);
  };
  useEffect(() => {
    setSuccess(status === 200 || status === 201);
    if(status === 200)
       props.setDisableField(true)
  }, [status,props]);

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
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/interviews/${interviewId}`,
        "PATCH",
        JSON.stringify({
          title: values.title,
          description: values.description,
          fieldTitle: field,
          date: doi,
          time: time,
          isCancelled: false,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  const sendInterviewRequestHandler = () => {
    const sendInterviewRequest = async () => {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/interviews/sendinterrequest/${props.interId}`,
          "PATCH",
          JSON.stringify({
            uid: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch (err) {
        console.log(err);
      }
    };
    sendInterviewRequest();
  };
  return (
    <>
      {isLoading && <LoadingSpinner open={isLoading} />}
      <Snackbar
        open={success || !!error}
        autoHideDuration={6000}
        onClose={status === 200 || status === 201 ? clearSuccess : clearError}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={status === 200 || status === 201 ? "success" : "error"}
          onClose={
            status === 200 || status === 201 ? clearSuccess : clearError
          }
        >
          {status === 200
            ? "Interview Updated Successfully!"
            : status === 201
            ? "Request has been sent to the Interview"
            : error}
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
                    id="title"
                    label="Title"
                    name="title"
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

            <Grid className={classes.submit}>
              {!props.disableField && props.hasEditAccess && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={
                    !(fProps.isValid || !field || !doi || fProps.isSubmitting)
                  }
                  startIcon={<BiSave style={{ marginLeft: 6 }} />}
                >
                  Save Changes
                </Button>
              )}

              {auth.setting.role === "Candidate" && (
                    onCandidateSentRequest(
                      props.userAddedInterviews,
                      props.interId
                    ) ? (
                      <div className={classes.Typo}>
                        <Typography
                          variant="subtitle2"
                          className={classes.statusStyle}
                        >
                          <BsPersonCheckFill className={classes.statusIconStyle} />
                          You are already ADDED to this Interview
                        </Typography>
                      </div>
                    ) : status === 201 ||
                      onCandidateSentRequest(
                        props.userSentRequests,
                        props.interId
                      ) ? (
                      // !onCandidateSentRequest(props.userAddedInterviews, props.interId)  ? (
                      <div className={classes.Typo}>
                        <Typography
                          variant="subtitle2"
                          className={classes.statusStyle}
                        >
                          <FiCheckSquare className={classes.statusIconStyle} />
                          You have SENT request on this Interview
                        </Typography>
                      </div>
                    ) : !onCandidateSentRequest(
                        props.userReceivedRequests,
                        props.interId
                      ) &&
                      props.InterviewStatus === "PENDING" &&
                      auth.setting.role === "Candidate" &&
                      !props.hasEditAccess ? (
                      <Button
                        onClick={sendInterviewRequestHandler}
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<BsBoxArrowInUpLeft style={{ marginLeft: 6 }} />}
                      >
                        Send Request
                      </Button>
                    ) : (
                      <div className={classes.Typo}>
                        <Typography
                          variant="subtitle2"
                          className={classes.statusStyle}
                        >
                          <BsPersonPlusFill className={classes.statusIconStyle} />
                          You are already INVITED to this Interview
                        </Typography>
                      </div>
                    )
              )}
          
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default UpdateInterview;