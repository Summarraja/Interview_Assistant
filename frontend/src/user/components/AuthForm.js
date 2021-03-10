import React, { useContext, useEffect, useState } from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";



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
}));

const AuthForm = props => {
    const setRememberme=props.setRememberme;
    const rememberme=props.rememberme;
    const error = props.error;
    const status = props.status;
    const classes = useStyles();
    const validationSchema = yup.object().shape({
        username: yup.string()
            .email("Please enter valid email")
            .required("Email is required"),
        password: yup.string()
            .min(6, "Password must be atleast 6 characters long")
            .required("Password is required"),
    });


    return (
        <React.Fragment>

            <Formik
                initialValues={props.initialValues}
                validationSchema={validationSchema}
                onSubmit={props.onSubmitHandler}
            >

                {(props) => (
                    <Form>
                        <Field
                            as={TextField}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="username"
                            autoComplete="email"
                            helperText={
                                <ErrorMessage
                                    name="username"
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
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            helperText={
                                <ErrorMessage
                                    name="password"
                                    style={{ color: "red", fontWeight: "bold" }}
                                />
                            }
                        />
                        <Field
                            as={FormControlLabel}
                            name="remember"
                            control={<Checkbox value="remember" color="secondary" checked={!!rememberme} onChange={() => { setRememberme(!rememberme) }} />}
                            label="Remember me"
                        />
                        {status === 401 ? (
                            <Typography className="MuiFormHelperText-root" align="center" variant="body1">{error}</Typography>
                        ) : " "}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={!(props.isValid || props.isSubmitting)}
                            className={classes.submit}
                        >
                            Sign In
                        </Button>

                    </Form>
                )}
            </Formik>
        </React.Fragment>
    );
};

export default AuthForm;
