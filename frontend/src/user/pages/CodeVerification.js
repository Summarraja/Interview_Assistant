import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import PhonelinkRingIcon from '@material-ui/icons/PhonelinkRing';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { Formik, Form } from "formik";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    Typography: {
        fontFamily: theme.typography.fontFamily,
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(2),
    },

    feilds: {
        width: "100%",

    },
    otpfield: {
        width: "50px",
        height: "50px",
        textAlign: "center",
        margin: "10px",
        border: "solid",
        borderColor: "#004777"

    },
    typo: {
        marginBottom: "20px"

    }

}));

export default function CodeVerification(props) {
    const auth = useContext(AuthContext);
    const [success, setSuccess] = useState(false);
    const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
    const userEmail = props.location.state.email;

    const paperStyle = {
        width: "100%",
        padding: 20,
        marginTop: "70px",
    };
    const avatarStyle = {
        backgroundColor: "primary",
    };
    const initialValues = {
        username: "",
    };
    const ButtonStyle = {
        minWidth: "160px",
        minHeight: "40px",
        margin: "10px 8px ",

    };

    const typostyle = {
        color: "black",
        fontWeight: "bold"

    };

    const classes = useStyles();
    const [otp, setOtp] = useState(new Array(4).fill(""));

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        //Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const onSubmitHandler = async (e) => {
        const code = otp.join("");
        try {
            const responseData = await sendRequest(
                'http://localhost:5000/api/users/verifyCode',
                'POST',
                JSON.stringify({
                    email: props.location.state.email,
                    code: code
                }),
                {
                    'Content-Type': 'application/json'
                }
            );
            if (responseData.isVerified) {
                auth.login(responseData.userId, responseData.token);
            }
            else {
            }
        }
        catch (err) {
        }

    };

    const onCancelHandler = (e) => {
        console.log("cancel")
        setOtp([...otp.map(v => "")]);
        if (otp.join("")) {
            console.log("in");
        }
    }

    const [DisableBtn, setDisableBtn] = useState(true);
    const [Play, SetIsPlay] = useState(true)
    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {

            return <div className="timer">Press Resend</div>;
        }

        return (
            <div className="timer">
                <Typography variant="h4">{remainingTime}</Typography>
            </div>
        );
    };
    const onResendHandler = async (e) => {
        try {
            const responseData = await sendRequest(
              'http://localhost:5000/api/users/sendCode',
              'POST',
              JSON.stringify({
                email: userEmail,
              }),
              {
                'Content-Type': 'application/json'
              }
            );
            if (responseData.status)
              setSuccess(true)
          }
          catch (err) {
          }
        SetIsPlay(true);
        setDisableBtn(true);
    }
    return (
        <Container component="main" maxWidth="sm" >
            <LoadingSpinner open={isLoading} />
            <Snackbar open={!!error} autoHideDuration={6000}>
                <MuiAlert elevation={6} variant="filled" severity="error" onClose={clearError}>
                    {error}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} >
                <MuiAlert elevation={6} variant="filled" severity="success" onClose={()=>{setSuccess(false)}}>
                    Code has been sent Successfully
                </MuiAlert>
            </Snackbar>
            <Paper elevation={10} style={paperStyle}>
                <Typography align="center" variant="h4">
                    Verification Code
                </Typography>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <PhonelinkRingIcon style={avatarStyle} />
                    </Avatar>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmitHandler}
                        onClick={onCancelHandler}
                    >
                        {(props) => (
                            <Form className={classes.form}>
                                <Typography className={classes.typo} variant="body1" align="center">
                                    The Verification Code has been sent to your provided Email {userEmail}.
                                </Typography>
                                <Typography variant="h5" align="center" style={typostyle} >
                                    Enter 4-digit Code
                                </Typography>
                                <Grid align="center">
                                    {otp.map((data, index) => {
                                        return (
                                            <input
                                                className={classes.otpfield}
                                                type="text"
                                                name="otp"
                                                maxLength="1"
                                                key={index}
                                                value={data}
                                                onChange={e => handleChange(e.target, index)}
                                                onFocus={e => e.target.select()}
                                            />
                                        );
                                    })}
                                    <p>OTP Entered - {otp.join("")}</p>
                                    {(error !== "") ? (<Typography className="MuiFormHelperText-root" >{error}</Typography>) : " "}
                                </Grid >
                                <Grid align="center" style={{ marginTop: "20px" }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        style={ButtonStyle}
                                        onSubmit={onSubmitHandler}
                                    >
                                        Verify Account
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        style={ButtonStyle}
                                        onClick={onCancelHandler}
                                    >
                                        Clear
                                    </Button>
                                </Grid>
                                <br />
                                <Grid className="timer-wrapper" align="center">
                                    <CountdownCircleTimer
                                        isPlaying={Play}
                                        duration={30}
                                        colors={[["#4E78A0"]]}
                                        onComplete={() => {
                                            setDisableBtn(false);
                                            SetIsPlay(false);
                                        }
                                        }
                                        size="120"
                                    >
                                        {renderTime}
                                    </CountdownCircleTimer>
                                </Grid>
                                <Grid align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={ButtonStyle}
                                        onClick={onResendHandler}
                                        disabled={DisableBtn}
                                    >
                                        Resend
                                    </Button>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </div>
                <Box mt={2}></Box>
            </Paper>
        </Container>
    );
}