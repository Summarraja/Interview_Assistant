import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
// import { useHttpClient } from '../../shared/hooks/http-hook';
// import { AuthContext } from '../../shared/context/auth-context';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import SelectBox from "../../shared/components/UIElements/FormElements/SelectBox";
import DatePicker from "../../shared/components/UIElements/FormElements/DatePicker";
import TimePicker from "../../shared/components/UIElements/FormElements/TimePicker";
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
  GridStyle :{
   margin : "0px 22px"
  },
 
  
}));


const fields = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const InterviewForm = (props) => {
  //     // const { isLoading, error, sendRequest } = useHttpClient();
  //     // const auth = useContext(AuthContext);
  const theme = useTheme();
  const classes = useStyles();
 
  const initialValues = {
    title: "",
    description: "",
  };

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

  const onSubmitHandler = async (values) => {
    // try {
    //     const responseData = await sendRequest(
    //         'http://localhost:5000/api/users/login',
    //         'POST',
    //         JSON.stringify({
    //             email: values.username,
    //             password: values.password
    //         }),
    //         {
    //             'Content-Type': 'application/json'
    //         }
    //     );
    //     auth.login(responseData.userId, responseData.token);
    // } catch (err) { }
  };
  return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
      >
        {(fProps) => (
          <Form>
            <Grid container>
              <Grid item xs={12} >
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
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
              <Grid item xs={12} >
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
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
              <Grid container  >
              <Grid item xs={3} sm={3} className = {classes.GridStyle} >
                <SelectBox
                  value={props.field}
                  setValue={props.setField}
                  title={"Select Field "}
                  data={fields}
                  fullWidth
                />
              </Grid>

              <Grid item xs={3} sm={3} className = {classes.GridStyle}>
                <DatePicker date={props.doi} setDate={props.setDoi} />
              </Grid>

              <Grid item xs={3} sm={3} className = {classes.GridStyle} >
              <TimePicker
                                time={props.timeOfInter}
                                setTime={props.setTimeOfInter}
                            />
              </Grid>
            </Grid>
            </Grid>
            {console.log("Field " + props.field)}
            {console.log("DOI " + props.doi)}
            {console.log("DOI " + props.timeOfInter)}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!(fProps.isValid || !props.field || !props.doi || fProps.isSubmitting)}
              className={classes.submit}
            >
              Create Interview
            </Button>
          </Form>
        )}
      </Formik>
  
  );
};

export default InterviewForm;
