import React, { useEffect, useState, useContext } from "react";
import SelectBox from "../../shared/components/UIElements/FormElements/SelectBox";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { AuthContext } from "../../shared/context/auth-context";


const useStyles = makeStyles((theme) => ({
  GridStyle: {
    marginTop: "15px",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },
  InterviewFields: {
    marginTop: 7,
  },
  submit: {
    textAlign: "center",
    marginTop: 8,
  },
  content: {
    margin:" 0% 21%"
  },
  preview: {
  textAlign: "center",
       width: "100%",
       height: "90%"
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
  institute: yup
    .string()
    .min(10, "Institute must be atleast 10 characters long")
    .required("Institute is required"),
  // CertificateImage: yup.mixed().required("A Certificate Image is required"),
});

const UpdateCertificate = (props) => {
  const certificateId = props.certId;
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [field, setField] = useState(props.loadedField.title);
  const [success, setSuccess] = useState(false);

  const clearSuccess = () => {
    setSuccess(false);
  };

  useEffect(() => {
    setSuccess(status == 200);
  }, [status]);

  const classes = useStyles();

  const initialValues = {
    title: props.loadedCertificate.title,
    description: props.loadedCertificate.description,
    institute: props.loadedCertificate.institute,
  };

  const onSubmitHandler = async (values) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/certificates/${certificateId}`,
        "PATCH",
        JSON.stringify({
          title: values.title,
          description: values.description,
          institute: values.institute,
          fieldTitle: field,
        }),

        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      status == 200 && props.setDisableField(true);
      status == 200 ? setSuccess(true) : setSuccess(false);
    } catch (err) {}
  };

  return (
    <>
      {isLoading && <LoadingSpinner open={isLoading} />}
      <Snackbar
        open={success || !!error}
        autoHideDuration={3000}
        onClose={status == "200" ? clearSuccess : clearError}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={status == "200" ? "success" : "error"}
          onClose={status == "200" ? clearSuccess : clearError}
        >
          {status == "200" ? "Certificate Updated Successfully!" : error}
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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      size="medium"
                      multiline
                      name="institute"
                      label="Institute"
                      id="institute"
                      disabled={props.disableField}
                      helperText={
                        <ErrorMessage
                          name="institute"
                          style={{ color: "red", fontWeight: "bold" }}
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} className={classes.GridStyle}>
                    <SelectBox
                      value={field}
                      setValue={setField}
                      title={"Select Field "}
                      data={fields}
                      fullWidth
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
                      props.loadedCertificate.isApproved
                        ? "APPROVED"
                        : "UNAPPROVED"
                    }
                    disabled
                    size="small"
                    label="Status"
                    id="status"
                  />
                </Grid>
              </Grid>
              <Grid className={classes.content}>
                <img
                  className={classes.preview}
                  src={"http://localhost:5000/" + props.loadedCertificate.file}
                  alt="Certificate Image"
                />

                <br />
              </Grid>
            </Grid>

            {/* <Grid className={classes.submit}>
              {!props.disableField && props.hasEditAccess && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={!(fProps.isValid || !field || fProps.isSubmitting)}
                  startIcon={<BiSave style={{ marginLeft: 6 }} />}
                >
                  Save Changes
                </Button>
              )}
            </Grid> */}
          </Form>
        )}
      </Formik>
    </>
  );
};
export default UpdateCertificate;
