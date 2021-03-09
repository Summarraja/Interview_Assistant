import React, { useState } from "react";
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
    typo:{
marginBottom:"20px"

    }

}));

export default function EmailVerification() {

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
    const [error, setError] = useState("");
    const [otp, setOtp] = useState(new Array(4).fill(""));

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        //Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const onSubmitHandler = (e) => {
        const code = "1234";
        if (code === otp.join("")) {
            console.log("code match");
            setError("Code Match!!")
            window.location = '/Home'
        }
        else {
            setError("You have entered wrong code!")
            console.log("You have entered wrong code!")
        }

    };

    const onCancelHandler = (e) => {
        console.log("cancel")
        setOtp([...otp.map(v => "")]);
        if (otp.join("")) {
            console.log("in");
            setError(" ");
        }
    }

    const [DisableBtn, setDisableBtn] = useState(true);
    const [Play, SetIsPlay] = useState(true)
    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
            setDisableBtn(false);
            SetIsPlay(false);
            return <div className="timer">Press Resend</div>;
        }

        return (
            <div className="timer">
                <Typography variant="h4">{remainingTime}</Typography>
            </div>
        );
    };
    const onResendHandler = (e) => {
        SetIsPlay(true);
        setDisableBtn(true);
    }
    return (
        <Container component="main"maxWidth="sm" >
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
                    //validationSchema={validationSchema}
                    >
                        {(props) => (
                            <Form className={classes.form}>
                                {console.log(props)}
                                <Typography className={classes.typo} variant="body1" align="center">
                                    The Verification Code has been sent to your provided Email.
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
                                <Grid align="center" style={{marginTop:"10px"}}>
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
                                        onComplete={() => [true, 1000]}
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