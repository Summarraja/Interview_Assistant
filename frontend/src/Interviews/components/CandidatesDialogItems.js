import React, { useContext, useState, useEffect } from "react";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import VideocamIcon from '@material-ui/icons/Videocam';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ListItemText from "@material-ui/core/ListItemText";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { BsFillPersonCheckFill } from "react-icons/bs";
import Typography from "@material-ui/core/Typography";
import { FaUserClock, FaUserCheck } from "react-icons/fa";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  ActionButton: {
    fontSize: "0.8rem",
    margin: "15px 0px",
    height: "32px",
    width: "140px",
    [theme.breakpoints.down("xs")]: {
      width: "120px",
      height: "30px",
    },
  },
  VideoCall:{
    fontSize: "0.8rem",
    margin: "15px 10px",
    height: "32px",
    width: "60px",
    [theme.breakpoints.down("xs")]: {
      width: "120px",
      height: "30px",
    },
  },
  listItem: {
    padding: "4px 8px",
  },
  statusStyle: {
    background: "#4E78A0",
    color: "#fff",
    textAlign: "center",
    height: "32px",
    marginTop: "12px ",
    paddingTop: "5px",
    alignContent: "center",
    width: "140px",
    borderRadius: 4,
  },
  statusIconStyle: {
    marginRight: "7px",
    transform: "translate(1px, 3px)",
    fontSize: "1rem",
  },
  list: {
    padding: 0,
  },
  responsive: {
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
    },
  },
}));
const CandidatesDialogItems = (props) => {

  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [responseStatus, setResponseStatus] = useState();

  const Users = [];
  Users.push(props.userId);
  const history = useHistory();

  const classes = useStyles();
  const [interview, setInterview] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/${props.interId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setInterview(responseData.interview);
      } catch (err) { }
    };
    props.interId && fetchInterview();
  }, []);

  function findAddedCandidates(arr1, arr2) {
    return arr1.some((item) => arr2 == item.id);
  }
  function findRequestedCandidates(arr1, arr2) {
    return arr1.some((item) => arr2 == item);
  }

  function findAcceptingCandidates(arr1, arr2) {
    return arr1.some((item) => arr2 == item.id);
  }


  const inviteCandidateHandler = () => {
    const sendInvitationRequest = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/invitecandidate/${props.interId}`,
          "PATCH",
          JSON.stringify({
            uid: props.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setInterview(responseData.interview);

      } catch (err) {
        console.log(err);
      }
    };
    sendInvitationRequest();
  };

  const removeCandidateHandler = () => {
    const removeAddedCand = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/removecandidate/${props.interId}`,
          "PATCH",
          JSON.stringify({
            uid: props.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setResponseStatus(responseData.responseDone);
        props.getInterviewRequestsData();
      } catch (err) {
        console.log(err);
      }
    };
    removeAddedCand();
  };
  const AcceptCandidateReqHandler = () => {
    const AcceptCandRequest = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/acceptcandidatereq/${props.interId}`,
          "PATCH",
          JSON.stringify({
            uid: props.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setResponseStatus(responseData.responseDone);
        props.getInterviewRequestsData();
      } catch (err) {
        console.log(err);
      }
    };
    AcceptCandRequest();
  };
  const clearSuccess = () => {
    setSuccess(false);
  };
  useEffect(() => {
    setSuccess(status == 201);
  }, [status]);
  return (
    <>
      {
        <Snackbar
          open={success || responseStatus == "removed" || !!error}
          autoHideDuration={6000}
          onClose={
            status == "201" || responseStatus == "removed"
              ? clearSuccess
              : clearError
          }
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={
              status == "201" || responseStatus == "removed"
                ? "success"
                : "error"
            }
            onClose={
              status == "201" || responseStatus == "removed"
                ? clearSuccess
                : clearError
            }
          >
            {status == "201"
              ? "Invitation has sent successfully!"
              : responseStatus == "removed"
                ? "Candidate has been removed from the Interview successfully!"
                : responseStatus == "accepted"
                  ? "Candidate Request has been accepted successfully!"
                  : error}
          </MuiAlert>
        </Snackbar>
      }

      {props.userId != auth.userId && (
        <List className={classes.list}>
          <Grid container>
            <Grid item xs={6} sm={6} className={classes.responsive}>
              <ListItem
                className={classes.listItem}
                button
                component={Link}
                to={`/profile/${props.userId}`}
              >
                <ListItemAvatar>
                  <Avatar
                    src={props.image}
                    style={{
                      height: "50px",
                      width: "50px",
                      marginRight: 10,
                    }}
                  />
                </ListItemAvatar>
                <ListItemText> {props.name} </ListItemText>
              </ListItem>
            </Grid>
            {isLoading && <LoadingSpinner open={isLoading} />}

            <Grid item sm={6} xs={6} align="center">
              {/* IF */}
              {props.interCandidates && !props.searchItem ? (
                Users.map(
                  (id) =>
                    findAddedCandidates(props.interCandidates, id) && (
                      <div style={{display:'inline'}}>
                        <Button
                          key={id}
                          variant="contained"
                          color="primary"
                          className={classes.VideoCall}
                          onClick={()=>{
                            history.push({
                              pathname: '/videocall',
                              state: { to: id, type: "interview" ,interview:props.interId, candidate:id}
                            });
                          }}
                          startIcon={
                            <VideocamIcon style={{ marginLeft: 6 }} />
                          }
                        />

                        <Button
                        
                          variant="contained"
                          color="primary"
                          className={classes.ActionButton}
                          onClick={removeCandidateHandler}
                          startIcon={
                            <PersonAddDisabledIcon style={{ marginLeft: 6 }} />
                          }
                        >
                          Remove
                      </Button>
                       </div>
                    )
                )
              ) : // ELSE
                //IF
                typeof interview.sentRequests !== "undefined" &&
                  props.interCandidates &&
                  props.interReceivedRequests ? (
                  //  else if
                  Users.map((id) =>
                    findAddedCandidates(props.interCandidates, id) ? (
                      <Typography
                        variant="subtitle2"
                        className={classes.statusStyle}
                        key={id}
                      >
                        <BsFillPersonCheckFill
                          className={classes.statusIconStyle}
                          key={id}
                        />
                      ADDED
                      </Typography>
                    ) : //  else if
                      findRequestedCandidates(interview.sentRequests, id) ||
                        status == 201 ? (
                        <Typography
                          variant="subtitle2"
                          className={classes.statusStyle}
                          key={id}
                        >
                          <FaUserClock
                            className={classes.statusIconStyle}
                            key={id}
                          />
                      REQUESTED
                        </Typography>
                      ) : //else
                        findAcceptingCandidates(props.interReceivedRequests, id) &&
                          status == "200" ? (
                          responseStatus == "accepted" ? (
                            <Typography
                              variant="subtitle2"
                              className={classes.statusStyle}
                              key={id}
                            >
                              <FaUserCheck
                                className={classes.statusIconStyle}
                                key={id}
                              />
                        ACCEPTED
                            </Typography>
                          ) : (
                            <Button
                              key={id}
                              variant="contained"
                              color="primary"
                              className={classes.ActionButton}
                              startIcon={<FaUserCheck style={{ marginLeft: 6 }} />}
                              onClick={AcceptCandidateReqHandler}
                            >
                              Accept
                            </Button>
                          )
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.ActionButton}
                            onClick={inviteCandidateHandler}
                            startIcon={<PersonAddIcon style={{ marginLeft: 6 }} />}
                            key={id}
                          >
                            Invite
                          </Button>
                        )
                  )
                ) : (
                  //ELSE
                  //ELSE
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.ActionButton}
                    onClick={inviteCandidateHandler}
                    startIcon={<PersonAddIcon style={{ marginLeft: 6 }} />}
                  //key={id}
                  >
                    Invite
                  </Button>
                )}
            </Grid>
          </Grid>
        </List>
      )}
    </>
  );
};

export default CandidatesDialogItems;