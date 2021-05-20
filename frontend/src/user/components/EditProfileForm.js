import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import SelectBox from "../../shared/components/UIElements/FormElements/SelectBox";
import DatePicker from "../../shared/components/UIElements/FormElements/DatePicker";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const EditProfileForm = (props) => {
  const countries = [
    "Afghanistan",
    "Åland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bangladesh",
    "Barbados",
    "Bahamas",
    "Bahrain",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "British Indian Ocean Territory",
    "British Virgin Islands",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burma",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo-Brazzaville",
    "Congo-Kinshasa",
    "Cook Islands",
    "Costa Rica",
    "$_[",
    "Croatia",
    "Curaçao",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "El Salvador",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Federated States of Micronesia",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Lands",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard and McDonald Islands",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn Islands",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Réunion",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Barthélemy",
    "Saint Helena",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin",
    "Saint Pierre and Miquelon",
    "Saint Vincent",
    "Samoa",
    "San Marino",
    "São Tomé and Príncipe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Swaziland",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Vietnam",
    "Venezuela",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const useStyles = makeStyles((theme) => ({
    form: {
      width: "100%",
      marginTop: theme.spacing(2),
    },
    submit: {
      margin: theme.spacing(0, 0, 2),
    },
  }));

  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [country, setCountry] = useState(auth.resume.country);
  const [dob, setdob] = useState(auth.resume.dob);
  const classes = useStyles();
  const [success, setSuccess] = useState(false);

  const clearSuccess = () => {
    setSuccess(false);
  };
  useEffect(() => {
    setSuccess(status == 200);
  }, [status]);

  const onSubmitHandler = async (values) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/resumes/${auth.resume._id}`,
        "PATCH",
        JSON.stringify({
          firstname: values.firstName,
          lastname: values.lastName,
          country: country,
          dob: dob,
          city: values.city,
          email: values.email,
          phone: values.contact,
          address: values.address,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      if (responseData.resume) {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        storedData.resume = responseData.resume;
        auth.setResume (responseData.resume);
        props.setMyResume(responseData.resume);

        localStorage.setItem("userData", JSON.stringify(storedData));
      }
    } catch (err) {}
  };

  return (
    <>
      {isLoading && <LoadingSpinner open={isLoading} />}
      <Snackbar
        open={success || !!error}
        autoHideDuration={6000}
        onClose={status == "200" ? clearSuccess : clearError}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={status == "200" ? "success" : "error"}
          onClose={status == "200" ? clearSuccess : clearError}
        >
          {status == "200" ? "Profile Updated Successfully!" : error}
        </MuiAlert>
      </Snackbar>

      <Formik
        initialValues={props.initialValues}
        onSubmit={onSubmitHandler}
        validationSchema={props.validationSchema}
      >
        {(fProps) => (
          <Form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  fullWidth
                  size="small"
                  id="firstName"
                  label="First Name"
                  autoFocus
                  helperText={
                    <ErrorMessage
                      name="firstName"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  size="small"
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  helperText={
                    <ErrorMessage
                      name="lastName"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectBox
                  value={country}
                  setValue={setCountry}
                  title={"Select country"}
                  data={countries}
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  date={dob}
                  setDate={setdob}
                  label="Date of Birth"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  size="small"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText={
                    <ErrorMessage
                      name="email"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="contact"
                  label="Contact No"
                  id="contact"
                  autoComplete="contact"
                  helperText={
                    <ErrorMessage
                      name="contact"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="city"
                  label="City"
                  id="city"
                  autoComplete="city"
                  helperText={
                    <ErrorMessage
                      name="city"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  size="small"
                  multiline
                  id="Address"
                  label="Address"
                  name="address"
                  autoComplete="Address"
                  helperText={
                    <ErrorMessage
                      name="address"
                      style={{ color: "red", fontWeight: "bold" }}
                    />
                  }
                />
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={
                  !(
                    fProps.isValid ||
                    !props.country ||
                    !props.dob ||
                    fProps.isSubmitting
                  )
                }
              >
                Save Changes
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default EditProfileForm;
