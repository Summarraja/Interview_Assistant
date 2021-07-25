import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InterviewList from "../components/InterviewList";
import bgInterview5 from "../../shared/components/UIElements/Images/bgInterview5.jpg";
import Box from "@material-ui/core/Box";
import { Paper } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import CreateInterview from "../components/CreateInterview";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    overflowY: "auto",
    backgroundColor: "#fff",
    paddingLeft: 60,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
  },

  hero: {
    width: "100%",
    height: 400,
    marginTop: 0,
    backgroundImage: `linear-gradient(
        to bottom,
        rgba(0, 27.8, 46.7, 0.7),
        rgba(78, 120, 160, 0.7)
      ), url(${bgInterview5})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      height: 300,
      fontSize: "3em",
    },
  },
  paper: {
    marginTop: "20px",
    // marginBottom: "10px",
    padding: "20px 20px",
    backgroundColor: "#d3d3d3",
  },
  button: {
    float: "right",
    marginBottom: 15,
  },
}));

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [role, setRole] = useState();

  const [userSentRequests, setUserSentRequests] = useState();
  const [userReceivedRequests, setUserReceivedRequests] = useState();
  const [userAddedInterviews, setUserAddedInterviews] = useState();

  const { isLoading, sendRequest } = useHttpClient();
  

  const auth = useContext(AuthContext);
  const { uid } = useParams();

  useEffect(() => {
    const getUserRole = async (usID) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/settings/user/` + usID,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setRole(responseData.setting.role);
      } catch (err) {
        console.log(err);
      }
    };
    if (uid === auth.userId) setRole(auth.setting.role);
    else getUserRole(uid);
  }, [uid,auth.setting.role,auth.token,auth.userId,sendRequest]);

  useEffect(() => {
    const getData = async (usID) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/interviews/user/` + usID,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setInterviews(responseData.interviews);
      } catch (err) {
        console.log(err);
      }
    };
    if (uid) getData(uid);
    else getData(auth.userId);
  }, [uid, role,auth.token,auth.userId,sendRequest]);

  useEffect(() => {
    const getCandidateRequestsData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/users/${auth.userId}`,
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

    if (auth.setting.role === "Candidate") {
      getCandidateRequestsData();
    }
  }, [auth.setting.role,auth.token,auth.userId,sendRequest]);

  const hasAccess = uid && uid === auth.userId;

  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Box className={classes.hero}>
          <Box style={{ fontFamily: "Serif, Open Sans, Arial" }}>
            Interviews
          </Box>
        </Box>
        <Container maxWidth="lg" component="main">
          <Paper elevation={5} className={classes.paper}>
            {role && role === "Interviewer" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleOpenDialog();
                }}
                className={classes.button}
                startIcon={<AddIcon />}
              >
                Create Interview
              </Button>
            )}
            {open && (
              <CreateInterview
                open={open}
                handleCloseDialog={handleCloseDialog}
                setOpen={setOpen}
                setInterviews = {setInterviews}
              />
            )}

          
            <LoadingSpinner open={isLoading} />
            {uid === auth.userId && auth.setting.role === "Candidate"
              ? !isLoading &&
                role &&
                userSentRequests &&
                userReceivedRequests &&
                userAddedInterviews && (
                  <InterviewList
                    uid={uid}
                    userAddedInterviews={userAddedInterviews}
                    setUserAddedInterviews={setUserAddedInterviews}
                    userSentRequests={userSentRequests}
                    setUserSentRequests={setUserSentRequests}
                    userReceivedRequests={userReceivedRequests}
                    setUserReceivedRequests={setUserReceivedRequests}
                    role={role}
                    hasAccess={hasAccess}
                  />
                )
              : !isLoading &&
                role &&
                interviews && (
                  <InterviewList
                    items={interviews}
                    role={role}
                    hasAccess={hasAccess}
                    setInterviews = {setInterviews}
                  />
                )}
          </Paper>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Interview;
