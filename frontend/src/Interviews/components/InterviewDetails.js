import React, {useState} from "react";
import SelectBox from "../../shared/components/UIElements/FormElements/SelectBox";
import DatePicker from "../../shared/components/UIElements/FormElements/DatePicker";
import TimePicker from "../../shared/components/UIElements/FormElements/TimePicker";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    GridStyle: {
      margin: " 0px 45px 0px 23px",
      [theme.breakpoints.down("xs")]:{
          marginLeft: 0,
         
      }
    },

    InterviewFields: {
      marginTop: 7,
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

  const InterviewDetails =()=>{
    const classes = useStyles();
    const [field, setField] = useState("Software Engineering");
    const [doi, setDoi] = useState("2021-04-21");
    const [time, setTime] = useState("11:00");
  return(
    <Formik
    // initialValues={initialValues}
    // validationSchema={validationSchema}
    // onSubmit={onSubmitHandler}
    >
      {(fProps) => (
        <Form>
          <Grid container>
            <Grid item = {true} xs={12} sm={7}>
              <Grid item = {true} xs={12}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="title"
                  label="Title"
                  name="title"
                  value="Interview for Hiring Front end developer"
                  disabled
                  helperText={
                    <ErrorMessage
                      name="title"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>
              <Grid item = {true} xs={12}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  multiline
                  name="description"
                  value="Description of hiring font end developer"
                  disabled
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
              <Grid
                container
                item = {true}
                xs={12}
                className={classes.InterviewFields}
              >
                <Grid item = {true} xs={12} sm={4}>
                  <FormControl>
                    <SelectBox
                      value={field}
                      setValue={setField}
                      title={"Select Field "}
                      data={fields}
                      fullWidth
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item = {true} xs={5} sm={3} className={classes.GridStyle}>
                  <FormControl>
                    <DatePicker
                      date={doi}
                      setDate={setDoi}
                      label="Set Interview Date"
                      disabled
                    />
                  </FormControl>
                </Grid>
    
                <Grid item = {true} xs={5} sm={3}>
                  <TimePicker time={time} setTime={setTime} disabled />
                </Grid>
              </Grid>
              <Grid
                container
                item
                spacing={2}
                xs={12}
                className={classes.InterviewFields}
              >
                <Grid item = {true} xs={12} sm={6}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="status"
                    value="PENDING"
                    disabled
                    size="small"
                    label="Status"
                    id="status"
                  />
                </Grid>
                <Grid item = {true} xs={12} sm={6}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="creator"
                    value="Urooj Tahir"
                    disabled
                    size="small"
                    label="Creator"
                    id="creator"
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item xs={6}></Grid> */}
          </Grid>
          {/* 
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
      // //    disabled={
      //       !(
      //         fProps.isValid ||
      //         !props.field ||
      //         !props.doi ||
      //         fProps.isSubmitting
      //       )
      //     }
          className={classes.submit}
        >
          Create Interview
        </Button> */}
        </Form>
      )}
    </Formik>
    
    
  );
  }
  export default InterviewDetails;
