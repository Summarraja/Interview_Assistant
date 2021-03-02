import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
// import { useHttpClient } from '../../shared/hooks/http-hook';
// import { AuthContext } from '../../shared/context/auth-context';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

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
  formControl: {
    minWidth: 160,
    maxWidth: 300,
  },
  textField: {
    minWidth: 160,
    maxWidth: 300,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const InterviewForm = (props) => {
  //     // const { isLoading, error, sendRequest } = useHttpClient();
  //     // const auth = useContext(AuthContext);
  const theme = useTheme();
  const classes = useStyles();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

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
    <React.Fragment>
      {/* <LoadingSpinner open={isLoading} /> */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
      >
        {(props) => (
          <Form>
            <Field
              as={TextField}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoComplete="title"
              helperText={
                <ErrorMessage
                  name="title"
                  style={{ color: "red", fontWeight: "bold" }}
                />
              }
            />

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
            <Grid container>
              <Grid item xs={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Field</InputLabel>
                  <Select
                    value={personName}
                    onChange={handleChange}
                    input={<Input />}
                    MenuProps={MenuProps}
                    fullWidth
                    variant="outlined"
                  >
                    {names.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, personName, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="time"
                  label="Set time"
                  type="time"
                  defaultValue="07:30"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!(props.isValid || props.isSubmitting)}
              className={classes.submit}
            >
              Create Interview
            </Button>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default InterviewForm;
