import React, { useContext, useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Typography from "@material-ui/core/Typography";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  ActionButton: {
    height: "32px",
    marginTop: "12px ",
    marginRight: "10px",
    // [theme.breakpoints.up("sm")]: {
    //   float: "left",
    // },
    [theme.breakpoints.down("xs")]: {
      height: "32px",
      width: "90px",
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
    marginRight: "3px",
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
const CandidateRequestsDialogItems = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const Users = [];
  Users.push(props.userId);

  const classes = useStyles();
  const [responseStatus, setResponseStatus] = useState();
  const [success, setSuccess] = useState(false);

  const AcceptCandidateReqHandler = () => {
    const AcceptCandRequest = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/interviews/acceptcandidatereq/${props.interId}`,
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
  const RejectCandidateReqHandler = () => {
    const RejectCandRequest = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/interviews/rejectcandidatereq/${props.interId}`,
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
    RejectCandRequest();
  };

  const clearSuccess = () => {
    setSuccess(false);
  };
  useEffect(() => {
    setSuccess(status === 200);
  }, [status]);
  return (
    <>
      {
        <Snackbar
          open={success || !!error}
          autoHideDuration={6000}
          onClose={status === 200 ? clearSuccess : clearError}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={status === 200 ? "success" : "error"}
            onClose={status === "200 " ? clearSuccess : clearError}
          >
            {status === 200 && responseStatus === "accepted"
              ? "Candidate Request has been accepted successfully!"
              : responseStatus === "rejected"
              ? "Candidate Request has been rejected successfully!"
              : error}
          </MuiAlert>
        </Snackbar>
      }

      {props.userId !== auth.userId && (
        <List className={classes.list}>
          <Grid container>
            <Grid item sm={6} xs={6} className={classes.responsive}>
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
              {status === 200 ? (
                <Typography variant="subtitle2" className={classes.statusStyle}>
                  {responseStatus === "accepted" ? (
                    <FaUserCheck className={classes.statusIconStyle} />
                  ) : (
                    <FaUserTimes className={classes.statusIconStyle} />
                  )}

                  {responseStatus === "accepted" ? "ACCEPTED" : "REJECTED"}
                </Typography>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.ActionButton}
                    startIcon={<FaUserCheck style={{ marginLeft: 6 }} />}
                    onClick={AcceptCandidateReqHandler}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.ActionButton}
                    startIcon={<FaUserTimes style={{ marginLeft: 6 }} />}
                    onClick={RejectCandidateReqHandler}
                  >
                    Reject
                  </Button>
                </>
              )}
            </Grid>

          </Grid>
        </List>
      )}
    </>
  );
};

export default CandidateRequestsDialogItems;
