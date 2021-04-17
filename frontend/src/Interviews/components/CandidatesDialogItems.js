import React, { useContext, useState, useEffect } from "react";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
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

const useStyles = makeStyles((theme) => ({
  RemoveButton: {
    fontSize: "0.8rem",
    margin: "15px 0px",
    height: "32px",
    width: "140px",
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

  const Users = [];
  Users.push(props.userId);

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
      } catch (err) {}
    };
    props.interId && fetchInterview();
  }, []);

  function findRequestedCandidates(arr1, arr2) {
    return arr1.some((item) => arr2 == item);
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
          open={success || !!error}
          autoHideDuration={6000}
          onClose={status == "201" ? clearSuccess : clearError}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={status == "201" ? "success" : "error"}
            onClose={status == "201" ? clearSuccess : clearError}
          >
            {status == "201" ? "Invitation has sent successfully!" : error}
          </MuiAlert>
        </Snackbar>
      }

      {props.userId != auth.userId && (
        <List className={classes.list}>
          <Grid container>
            <Grid item xs={6} sm={8} className={classes.responsive}>
              <ListItem
                className={classes.listItem}
                button
                component={Link}
                to="/profile"
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

            <Grid item sm={4} xs={6} align="center">
              {typeof interview.sentRequests !== "undefined" ? (
                Users.map((id) => 
                  findRequestedCandidates(interview.sentRequests, id) ||
                  status == 201 ? (
                    <Typography
                      variant="subtitle2"
                      className={classes.statusStyle}
                      key={id}
                    >
                      <BsFillPersonCheckFill
                        className={classes.statusIconStyle}
                        key={id}
                      />
                      REQUESTED
                    </Typography>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.RemoveButton}
                      onClick={inviteCandidateHandler}
                      startIcon={<PersonAddIcon style={{ marginLeft: 6 }} />}
                      key = {id}
                    >
                      Invite
                    </Button>
                  )
                )
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.RemoveButton}
                  // startIcon={
                  //   <PersonAddDisabledIcon style={{ marginLeft: 6 }} />
                  // }
                  onClick={inviteCandidateHandler}
                  startIcon={<PersonAddIcon style={{ marginLeft: 6 }} />}
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
