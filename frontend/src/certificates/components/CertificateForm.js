import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import SelectBox from "../../shared/components/UIElements/FormElements/SelectBox";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Typography } from "@material-ui/core";
import UploadPhoto from "../../user/components/UploadPhoto";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  Typography: {
    fontFamily: theme.typography.fontFamily,
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
  GridStyle: {
    margin: "20px 22px",
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
  uploadImageText: {
    fontFamily: "Times New Roman",
    fontSize: "0.8rem",
  },
  content: {
    textAlign: "center",
  },
  preview: {
    alignContent: "center",
    width: "70%",
    height: "70%",
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

const CertificateForm = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();
  const theme = useTheme();
  const classes = useStyles();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const clearSuccess = () => {
    setSuccess(false);
    props.setOpen(false);
  };
  useEffect(() => {
    setSuccess(status == 201);
  }, [status]);

  const initialValues = {
    title: "",
    description: "",
    institute: "",
    //   CertificateImage: "",
  };

  // const FILE_SIZE = 160 * 1024;
  // const SUPPORTED_FORMATS = [
  //   "image/jpg",
  //   "image/jpeg",
  //   "image/gif",
  //   "image/png",
  // ];

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
     //CertificateImage: yup.mixed().required("A Certificate Image is required"),
    //   .test(
    //     "fileSize",
    //     "File too large",
    //     value => value && value.size <= FILE_SIZE
    //   )
    //   .test(
    //     "fileFormat",
    //     "Unsupported Format",
    //     value => value && SUPPORTED_FORMATS.includes(value.type)
    //   )
  });

  const onSubmitHandler = async (values) => {
    console.log("File: " + file)
    try {
      const formData = new FormData();
      formData.append( 'title', values.title);
      formData.append( 'description', values.description);
      formData.append( 'institute', values.institute);
      formData.append( 'fieldTitle', props.field);
      formData.append('file', file);
      const responseData = await sendRequest(
        "http://localhost:5000/api/certificates/",
        "POST",
        formData,
        {
          // "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(responseData.certificate)
      props.fetchCertificates();
    } catch (err) {}
  };

  return (
    <>
      <LoadingSpinner open={isLoading} />
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
          {status == "201" ? "Certificate Added Successfully!" : error}
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
                  size="medium"
                  id="title"
                  label="Title"
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
                  size="medium"
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
              <Grid container>
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
                    autoComplete="institute"
                    helperText={
                      <ErrorMessage
                        name="institute"
                        style={{ color: "red", fontWeight: "bold" }}
                      />
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={5} className={classes.GridStyle}>
                  <SelectBox
                    value={props.field}
                    setValue={props.setField}
                    title={"Select Field "}
                    data={fields}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} align="center">
                {/* <UploadCertificate
                  center
                /> */}
                {/* <input
                  style={{ display: "none" }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  onChange={pickedHandler}
                /> */}
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  multiple
                  name="CertificateImage"
                  // onChange={(event) => {
                  //   fProps.setFieldValue(
                  //     "CertificateImage",
                  //     event.target.files[0]
                  //   );
                  // }}
                  onChange = {pickedHandler}
                />

                <div className={classes.content}>
                  <img className={classes.preview} src={previewUrl} />
                  <br />
                </div>

                <label htmlFor="contained-button-file">
                  <Button
                    startIcon={<CloudUploadIcon />}
                    variant="contained"
                    color="secondary"
                    component="span"
                   // onClick={handleOpenDialog}
                  >
                    Attach Certificate
                  </Button>

                  {/* {open && (
                <UploadPhoto
                  open={open}
                  handleCloseDialog={handleCloseDialog}
                  setOpen={setOpen}
                  attachCertificate={attachCertificate}
                  setAttachCertificate = {setAttachCertificate}
                  setCertificateFile = {setCertificateFile}

                />
              )} */}
                </label>
                <div
                  style={{ color: "#004777" }}
                  className={classes.uploadImageText}
                >
                  {file
                    ? file.name
                    : "No file Chosen"}
                </div>
              </Grid>
            </Grid>
           {/* {console.log("file: "+       (!(fProps.isValid || !props.field || fProps.isSubmitting ) && file))} */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={
                !(fProps.isValid || !props.field || fProps.isSubmitting ) 
              }
              className={classes.submit}
            >
              Send Approval Request
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CertificateForm;
