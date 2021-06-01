import React, { useState, useContext, useEffect } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import CallIcon from "@material-ui/icons/Call";
import VideocamIcon from "@material-ui/icons/Videocam";
import Button from "@material-ui/core/Button";
import HomeIcon from '@material-ui/icons/Home';
import "./UserItem.css";
import WorkIcon from "@material-ui/icons/Work";
import Paper from "@material-ui/core/Paper";
import EditIcon from '@material-ui/icons/Edit';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { Link } from "react-router-dom";
import UploadPhoto from "./UploadPhoto";
import SendMessage from "./SendMessage";
import { AuthContext } from '../../shared/context/auth-context';
import { RiUserUnfollowFill } from "react-icons/ri";
import { FaRegAddressCard } from "react-icons/fa";
import EditProfile from "./EditProfile";
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
  Avatar: {
    display: "flex",
    alignItems: "center",
    margin: "auto",
    border: '1px solid lightgray',
    width: 150,
    height: 150,
    transform: "translate(0px, 65px)",
  },
  cameraIcon: {
    display: "flex",
    width: 40,
    height: 30,
    color: "#004777",
    transform: "translate(19rem, 2rem)",
    [theme.breakpoints.down("xs")]: {
      transform: "translate(16rem, 2rem)",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    textAlign: "center",
  },
  paperStyle: {
    width: "100%",
    margin: "63px auto",
    paddingBottom: "30px",
  },
}));

const UserItem = (props) => {
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [success, setSuccess] = useState(false);

  const [resMsg, setResMsg] = useState("");
  const [showBlockBtn, setShowBlockBtn] = useState(false);
  const history = useHistory();



  const clearSuccess = () => {
    setSuccess(status !== 200);

  };
  useEffect(() => {
    setSuccess(status === 200);
  }, [status, showBlockBtn]);


  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleMsgOpenDialog = () => {
    setMsgOpen(true);
  };
  const handleMsgCloseDialog = () => {
    setMsgOpen(false);
  };

  const OpenEditDialogComp = () => {
    setOpenEdit(true);
  };
  const CloseEditDialogComp = () => {
    setOpenEdit(false);
  };



  const BlockUserHandler = () => {
    const BlockUser = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/settings/blockUser/" + auth.setting._id,
          'PATCH',
          JSON.stringify({
            uid: props.resume.user
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        if (responseData.responseMessage === "blocked") {
          setResMsg(responseData.responseMessage)
          setShowBlockBtn(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
    BlockUser();
  }

  function findBlockedUsers(arr1, arr2) {
    return arr1.some((item) => arr2 === item);
  }


  const classes = useStyles();

  const RTCiconStyle = {
    margin: "20px",
    color: "#004777",
    fontSize: "2rem",
  };

  const resumeButtonStyle = {
    margin: "10px 8px ",
    alignItems: "center",
  };

  const divstyle = {
    textAlign: "center",
    // margin: "0px",
  };
  const divIconStyle = {
    paddingRight: "5px",
    transform: "translate(2px, 7px)",
    color: "#696969",
  };
  const divDetails = {
    display: "flex",
    width: "100%",
  };
  const typoStyle = {
    flexGrow: 1,
    margin: 0,
    color: "#fff",
  };
  const accordStyle = {
    background:
      "linear-gradient( rgba(0, 27.8, 46.7, 0.7), rgba(78, 120, 160, 1))",
    margin: "20px 80px",
  };
  const topBorder = {
    width: "100%",
    height: 150,
    margin: 0,
    background:
      "linear-gradient( rgba(0, 27.8, 46.7, 1),rgba(78, 120, 160, 1))",
  };


  return (
    <>
      {isLoading && <LoadingSpinner open={isLoading} />}
      {!isLoading && (
        <Snackbar
          open={success || !!error}
          autoHideDuration={3000}
          onClose={status === 200 ? clearSuccess : clearError}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={status ===  200 ? "success" : "error"}
            onClose={status === 200 ? clearSuccess : clearError}
          >
            {(status === 200 && resMsg === "blocked") ? "User has blocked successfully!" : error}
          </MuiAlert>
        </Snackbar>

      )}

      <Paper elevation={10} className={classes.paperStyle}>
        <div style={topBorder}>
          <Avatar
            className={classes.Avatar}

            alt={props.resume.fullname}
            src={"http://localhost:5000/" + props.resume.image}

          />

          {props.setting && !((findBlockedUsers(props.setting.blockedUsers, props.resume.user)) || showBlockBtn) && (
            <Button
              style={{ float: "right", margin: 10 }}
              type="submit"
              variant="contained"
              color="primary"
              startIcon={props.otherUser ? <RiUserUnfollowFill /> : <EditIcon />}
              size="small"
              onClick={props.otherUser ? BlockUserHandler : OpenEditDialogComp}

            >
              {props.otherUser ? "Block User" : "Edit Profile"}
            </Button>
          )}


          {openEdit && (
            <EditProfile
              openEdit={openEdit}
              CloseEditDialogComp={CloseEditDialogComp}
              setOpenEdit={setOpenEdit}
              userId={auth.resume.user}
              setMyResume={props.setMyResume}
            />
          )}
          {!props.otherUser && (
            <>
              <IconButton className={classes.cameraIcon} onClick={handleOpenDialog} >

                <PhotoCameraIcon style={{ width: "30px", height: "40px" }} />

              </IconButton>
              {open && (
                <UploadPhoto
                  open={open}
                  handleCloseDialog={handleCloseDialog}
                  setOpen={setOpen}
                />
              )}
            </>
          )}

        </div>

        <div style={{ textAlign: "center", marginTop: 70, width: "100%" }}>
          <Typography variant="h4">{props.resume.fullname}</Typography>
        </div>
        {props.otherUser && (
          <>
            <Grid align="center" style={{ marginBottom: 0 }}>
              <IconButton style={{ padding: "0px 5px" }} onClick={handleMsgOpenDialog}>
                <ChatIcon style={RTCiconStyle} />
              </IconButton>
              {msgOpen && (
                <SendMessage
                  open={msgOpen}
                  handleCloseDialog={handleMsgCloseDialog}
                  setOpen={setMsgOpen}
                  receiver={props.otherUser}
                />
              )}
              <IconButton style={{ padding: "0px 5px" }} onClick={() => {
                history.push({
                  pathname: '/videocall',
                  state: { to: props.otherUser, type: "audio" }
                });
              }}>
                <CallIcon style={RTCiconStyle} />
              </IconButton>
              <IconButton style={{ padding: "0px 5px" }} onClick={() => {
                history.push({
                  pathname: '/videocall',
                  state: { to: props.otherUser, type: "video" }
                });
              }}>
                <VideocamIcon style={RTCiconStyle} />
              </IconButton>
            </Grid>
          </>
        )}

        <div style={divstyle}>
          <Typography variant="subtitle1">
            <WorkIcon style={divIconStyle} /> {props.resume.email}
          </Typography>

          <Typography variant="subtitle1">
            <LocationOnIcon style={divIconStyle} /> From {props.resume.city + " " + props.resume.country}
          </Typography>

          <Typography variant="subtitle1">
            < HomeIcon style={divIconStyle} />
            Lives at {props.resume.address}
          </Typography>

        </div>

        <Accordion style={accordStyle} expanded={true}>
          <AccordionSummary
            //expandIcon={<ExpandMoreIcon />} 
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading} align="justify">
              My Interviews
              </Typography>
          </AccordionSummary>
          <AccordionDetails lg={12} md={6}>
            <Typography style={typoStyle}>
              {props.userInter.length + " "}
              {props.userInter.length === 0 || 1 ? "Interview" : "Interviews"}
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              component={Link}
              to={`/interviews/${props.resume.user}`}
            >
              View Interviews
              </Button>
          </AccordionDetails>
        </Accordion>
        <Accordion style={accordStyle} expanded={true}>
          <AccordionSummary
            //   expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading} align="justify">
              My Certificates
            </Typography>
          </AccordionSummary>
          <AccordionDetails lg={12} md={6}>
            <div style={divDetails}>
              <Typography style={typoStyle}>

                {props.approvedCertCount + " "}
                {props.approvedCertCount === 0 || 1
                  ? "Certificate"
                  : "Certificates"}
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                component={Link}
                to={`/certificates/${props.resume.user}`}
              >
                View Certificates
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>

        <Grid align="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            style={resumeButtonStyle}
            startIcon={<FaRegAddressCard />}
            component = {Link}
            to ="/resume"
          >
            {props.otherUser ? `${props.resume.firstname} Resume` : "My Resume"}
          </Button>
        </Grid>
      </Paper>
    </>
  );
};

export default UserItem;
