import React, { useState, useContext, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ListAltIcon from "@material-ui/icons/ListAlt";
import UpdateInterview from "../components/UpdateInterview";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid"
import { BiEdit } from "react-icons/bi";



const useStyles = makeStyles((theme) => ({
  GridStyle: {
    margin: " 0px 45px 0px 23px",
  },
   paperStyle : {
    width: "100%",
    padding: 20,
    margin: "80px auto",
    [theme.breakpoints.down("xs")]: {
     paddingBottom: "50px"
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  InterviewFields: {
    marginTop: 7,
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submit: {
   textAlign: "center", 
   marginTop: 10
  },
}));

const ViewInterview = (props) => {
  const auth = useContext(AuthContext);
  const { interId } = useParams();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [loadedInterview, setLoadedInterview] = useState();
  const [loadedField, setLoadedField] = useState();
  const [disableField, setDisableField] = useState(true);
  const [userSentRequests, setUserSentRequests] = useState();
  const [userReceivedRequests, setUserReceivedRequests] = useState();
  const [userAddedInterviews, setUserAddedInterviews] = useState();
  //const theme = useTheme();

  const EnableFieldsHandler = () => {
    setDisableField(false);
  };
  const today = new Date();

  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const CurrentDate = new Date(date);

 
  useEffect(() => {
    const getCandidateSentReq = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${auth.userId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setUserSentRequests(responseData.sentRequests);
        setUserReceivedRequests(responseData.receivedRequests);
        setUserAddedInterviews(responseData.addedInterviews);

      } catch (err) {
        console.log(err);
      }
    };

  
      getCandidateSentReq();
    
  }, []);
  // Request to get sepcific Interview Details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/${interId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedInterview(responseData.interview);
      } catch (err) {}
    };
    if (!loadedInterview) fetchInterview();
  }, [loadedInterview]);

  // Request to get field title of fetched Interview

  useEffect(() => {
    const fetchField = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/fields/${loadedInterview.field}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedField(responseData.field);
      } catch (err) {}
    };
    if (!loadedField) fetchField();
  }, [loadedField, loadedInterview]);

  const hasEditAccess = loadedInterview && loadedInterview.creator == auth.userId;
  const InterviewStatus =  loadedInterview && loadedInterview.isCancelled
      ? "CANCELLED"
      : new Date(loadedInterview && loadedInterview.date) > CurrentDate
      ? "PENDING"
      : "TAKEN"
  
  
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={10} className={classes.paperStyle}>
        <Typography align="center" variant="h4">
          Interview Details
        </Typography>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ListAltIcon style={avatarStyle} />
          </Avatar>
        </div>
        
        {!isLoading && loadedInterview && loadedField && userSentRequests && userReceivedRequests && userAddedInterviews ? (
          <UpdateInterview
            interId={interId}
            disableField={disableField}
            setDisableField = {setDisableField}
            loadedInterview={loadedInterview}
            loadedField={loadedField}
            hasEditAccess={hasEditAccess}
            InterviewStatus = {InterviewStatus}
            userAddedInterviews = {userAddedInterviews}
            userSentRequests = {userSentRequests}
            userReceivedRequests = {userReceivedRequests}

          />
        ) : (
          <LoadingSpinner open={isLoading} />
        )}
       
      <Grid  className={classes.submit}>
        {disableField && hasEditAccess && InterviewStatus == "PENDING" && (
          <Button
            onClick={EnableFieldsHandler}
            variant="contained"
            color="primary"
            size = "small"
            startIcon={<BiEdit style={{ marginLeft: 6 }} />}
          
          >
           Edit Details
          </Button>
        )}
     
        </Grid>
       
      </Paper>
    </Container>
  );
};

export default ViewInterview;
