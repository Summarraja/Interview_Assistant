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
import { BsUnlockFill } from "react-icons/bs";
import Typography from "@material-ui/core/Typography";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { AiFillUnlock } from "react-icons/ai";

const useStyles = makeStyles((theme) => ({
  ActionButton: {
    height: "32px",
    marginTop: "12px ",
    marginRight: "10px",
    [theme.breakpoints.up("sm")]: {
      float: "right",
    },
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
const UserBlockedListDialogItems = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const classes = useStyles();
  const [responseStatus, setResponseStatus] = useState();
  const [success, setSuccess] = useState(false);

  const clearSuccess = () => {
    setSuccess(false);
  };
  useEffect(() => {
    setSuccess(status == 200);
  }, [status]);

  const UnblockUserHandler = () =>{
    const UnblockUser = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/settings/UnblockUser/" + auth.setting._id,
          'PATCH',
          JSON.stringify({
           uid: props.userId
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        if(responseData.responseMessage == "Unblocked"){
            setResponseStatus(responseData.responseMessage)
          
        }
      } catch (err) {
        console.log(err);
      }
  }
  UnblockUser();
  }

  return (
    <>
      {
        <Snackbar
          open={success || !!error}
          autoHideDuration={6000}
          onClose={status == "200" ? clearSuccess : clearError}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={status == "200" ? "success" : "error"}
            onClose={status == "200 " ? clearSuccess : clearError}
          >
            {status == "200" && responseStatus == "Unblocked"
              ? "User has unblocked successfully!"
              : error}
          </MuiAlert>
        </Snackbar>
      }

        <List className={classes.list}>
          <Grid container>
            <Grid item xs={8} className={classes.responsive}>
              <ListItem
                className={classes.listItem}
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

            <Grid item  xs={4} >
               {status == "200" && responseStatus == "Unblocked"? (
                <Typography variant="subtitle2" className={classes.statusStyle}>
                    <AiFillUnlock className={classes.statusIconStyle} />
                    Unblocked
                </Typography> 
              ) : (  
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.ActionButton}
                    startIcon={<AiFillUnlock style={{ marginLeft: 6 }} />}
                    onClick={UnblockUserHandler}
                  >
                    Unblock
                  </Button>
                 
            
               )} 
            </Grid>

          </Grid>
        </List>
    </>
  );
};

export default UserBlockedListDialogItems;
