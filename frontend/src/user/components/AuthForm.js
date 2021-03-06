import React, { useContext, useEffect, useState } from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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
    const { isLoading, error,status, sendRequest,clearError } = useHttpClient();
    const [rememberme,setRememberme] = useState(false);
    const auth = useContext(AuthContext);

    const classes = useStyles();

    const initialValues = {
        username: "",
        password: "",
    };
    useEffect(()=>{
        if (localStorage.checkbox ==="true") {
            setRememberme(true);
            initialValues.username = localStorage.username;
            initialValues.password = localStorage.password;
          } else {
            setRememberme(false);
          }
    },[]);
    
    const validationSchema = yup.object().shape({
        username: yup.string()
            .email("Please enter valid email")
            .required("Email is required"),
        password: yup.string()
            .min(6, "Password must be atleast 6 characters long")
            .required("Password is required"),
    });

    const onSubmitHandler = async (values) => {
        if (rememberme) {
            localStorage.username = values.username;
            localStorage.password = values.password;
            localStorage.checkbox = "true";
          } else {
            localStorage.username = "";
            localStorage.password = "";
            localStorage.checkbox = "false";
          }
        try {
            const responseData = await sendRequest(
                'http://localhost:5000/api/users/login',
                'POST',
                JSON.stringify({
                    email: values.username,
                    password: values.password
                }),
                {
                    'Content-Type': 'application/json'
                }
            );
            auth.login(responseData.userId, responseData.token);
        } catch (err) {}
    };
    return (
        <React.Fragment>                
            <LoadingSpinner open={isLoading} />
            {status!=401&&(      
            <Snackbar open={error} autoHideDuration={6000} onClose={clearError}>
                <MuiAlert elevation={6} variant="filled"  severity="error"  onClose={clearError}>
                  {error}
                </MuiAlert>
              </Snackbar>
              )}
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
                            control={<Checkbox value="remember" color="secondary" checked={rememberme} onChange={()=>{setRememberme(!rememberme)}}/>}
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
