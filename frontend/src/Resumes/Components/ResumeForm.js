import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import RadioButtons from "../../user/components/RadioButtons";
import SelectBox from "../../shared/components/UIElements/FormElements/SelectBox";
import DatePicker from "../../shared/components/UIElements/FormElements/DatePicker";



const ResumeForm = (props) => {
    const countries = ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', '$_[', 'Croatia', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

    const useStyles = makeStyles((theme) => ({
        form: {
            width: "100%",
            marginTop: theme.spacing(2),
        },
        submit: {
            margin: theme.spacing(1, 0, 1),
        },
    }));
    const classes = useStyles();

    return (
        <Formik
            initialValues={props.initialValues}
            // onSubmit={props.signUpSubmitHandler}
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
                             value={props.country}
                                setValue={props.setCountry}
                                title={"Select country"}
                                size="small"
                                data={countries}
                                fullWidth />

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                date={props.dob}
                                size="small"
                                setDate={props.setdob}
                                label="Date of Birth"
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
                                type="city"
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

                        <Grid item xs={12} sm={6}>
                            <Field
                                as={TextField}
                                variant="outlined"
                                fullWidth
                                size="small"
                                name="maxEducation"
                                label="MaxEducation"
                                type="maxEducation"
                                id="maxEducation"
                                helperText={
                                    <ErrorMessage
                                        name="maxEducation"
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
                                id="experience"
                                label="Experience"
                                name="experience"
                                autoComplete="experience"
                                helperText={
                                    <ErrorMessage
                                        name="experience"
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
                                id="field"
                                label="field"
                                name="field"
                                autoComplete="field"
                                helperText={
                                    <ErrorMessage
                                        name="field"
                                        style={{ color: "red", fontWeight: "bold" }}
                                    />
                                }
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <RadioButtons
                                gender={props.gender}
                                setGender={props.setGender}
                            />

                        </Grid>
                        
                        <Button
                            type="submit"
                            fullWidth
                            
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={!(fProps.isValid || !props.gender || !props.country || !props.dob || fProps.isSubmitting)}
                        >
                            Create
              </Button>
                    </Grid>
                </Form>
            )}
        </Formik>

    );
}
export default ResumeForm;
