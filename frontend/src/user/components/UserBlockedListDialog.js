import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { FaUserLock } from "react-icons/fa";
import UserBlockedListDialogItems from "./UserBlockedListDialogItems";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  search: {
    margin: theme.spacing(2),
  },
  dialogTitle: {
    variant: "h6",
    fontSize: "1.3rem",
    color: theme.palette.primary.main,
  },
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const UserBlockedListDialog = (props) => {
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const handleCloseDialog = () => {
    props.setOpenBlockedDialog(false);
  };
  const classes = useStyles();

  const [blockedUserResume, setBlockedUserResume] = useState([]);

  useEffect(() => {
    setBlockedUserResume([]);
    const fetchblockedUserResume = async (candID) => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/resumes/user/${candID}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );

        setBlockedUserResume((oldArray) => [...oldArray, responseData.resume]);
      } catch (err) {
        console.log(err);
      }
    };
    props.blockedUsers.length !== 0 && props.blockedUsers.map((user) => fetchblockedUserResume(user._id));
  }, [props.blockedUsers]);

  return (
    <div>
      <Dialog
        onClose={handleCloseDialog}
        open={props.openBlockedDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle onClose={handleCloseDialog} disableTypography>
          <Typography variant="h4" align="center">
            Blocked Users
          </Typography>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <FaUserLock style={avatarStyle} />
            </Avatar>
          </div>
        </DialogTitle>
        {isLoading && <LoadingSpinner open={isLoading} />}
        <DialogContent dividers>
          <div align="center">
            {blockedUserResume && blockedUserResume.length === 0
              ? "No blocked users are found. "
              : blockedUserResume.map((user) => (
                  <UserBlockedListDialogItems
                    key={user.id}
                    id={user.id}
                    name={user.fullname}
                    userId = {user.user}
                    //  image={candidate.image}
                  />
                ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserBlockedListDialog;
