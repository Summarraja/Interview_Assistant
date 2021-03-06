import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, Divider, withStyles } from "@material-ui/core";
import { IoMdEye } from "react-icons/io";
import { FaRegCheckCircle, FaRegClock } from "react-icons/fa";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";
import OutsideClickHandler from "react-outside-click-handler";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IconButton from "@material-ui/core/IconButton";
import { grey } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import BlockIcon from "@material-ui/icons/Block";
import InterviewMenu from "./InterviewMenu";
import ViewInterview from "../pages/ViewInterview";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    display: "flex",
    marginTop: "15px",
    padding: "10px 17px",
    // background:
    //   "linear-gradient( rgba(0, 27.8, 46.7, 0.7), rgba(78, 120, 160, 0.5))",
  },
  header: {
    flexGrow: 1,
  },
  ViewButton: {
    height: "35px",
    marginTop: "12px ",
    marginRight: "10px",
    [theme.breakpoints.up("sm")]: {
      float: "right",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: "0px",
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: "10px",
    },
  },
  statusStyle: {
    background: "#4E78A0",
    color: "#fff",
    textAlign: "center",
    height: "35px",
    marginTop: "12px ",
    paddingTop: "5px",
    alignContent: "center",
    width: "140px",
    borderRadius: 4,
    float: "right",
  },
  statusIconStyle: {
    marginRight: "7px",
    transform: "translate(1px, 3px)",
    fontSize: "1rem",
  },
}));

const InterviewItems = (props) => {
  const MoreIconStyle = {
    marginTop: "5px",
  };
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const classes = useStyles();

  const theme = useTheme();
  // const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const today = new Date();

  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const CurrentDate = new Date(date);

  const [InterviewMobAnchorEl, setInterviewMobAnchorEl] = useState(null);
  const isInterviewMenuOpen = Boolean(InterviewMobAnchorEl);

  const openInterviewMenu = (event) => {
    setInterviewMobAnchorEl(event.currentTarget);
  };
  const closeInterviewMenu = () => {
    setInterviewMobAnchorEl(null);
  };

  const [interSentRequests, setInterSentRequests] = useState();
  const [interReceivedRequests, setInterReceivedRequests] = useState();
  const [interCandidates, setInterCandidates] = useState();

  useEffect(() => {
    const getInterviewRequestsData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/interviewreq/${props.id}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setInterSentRequests(responseData.sentRequests);
        setInterReceivedRequests(responseData.receivedRequests);
        setInterCandidates(responseData.candidates);
      } catch (err) {
        console.log(err);
      }
    };

    if (auth.setting.role == "Interviewer") {
      getInterviewRequestsData();
    }
  }, []);

  const InterviewMobileMenu = (
    <Menu
      anchorEl={InterviewMobAnchorEl}
      id="Int-mob-menu"
      keepMounted
      open={isInterviewMenuOpen}
      // anchorOrigin={{
      //   vertical: "right",
      //   horizontal: "bottom",
      // }}
      getContentAnchorEl={null}
    >
      {/* {matches && (
        
        <MenuItem
          style={{ height: 40 }}
          component={Link}
          to={`/interviews/view/${props.id}`}
        >
          <IconButton color="primary">
            <IoMdEye />
          </IconButton>
          <Typography variant="subtitle1">View Details</Typography>
        </MenuItem>
      )}
          <Divider variant="middle" /> */}
      <>
    {props.hasAccess && props.role == "Interviewer" && (
    
          <InterviewMenu
            closeInterviewMenu={closeInterviewMenu}
            status={props.status}
            intId={props.id}
            interSentRequests={interSentRequests}
            setInterSentRequests={setInterSentRequests}
            interReceivedRequests={interReceivedRequests}
            setInterReceivedRequests={setInterReceivedRequests}
            interCandidates={interCandidates}
            setInterCandidates={setInterCandidates}
            setInterviews={props.setInterviews}
          />

          )}

          </>

      </Menu>
    

    
  );

  return (
    <>
      <Card className={classes.card}>
        <Grid container spacing={5}>
          <Grid item sm={6} lg={7} style={{ flexGrow: 1 }}>
            <div className={classes.header}>
              <Typography variant="h5" align="justify">
                {props.title}
              </Typography>
              <Typography variant="subtitle1" style={{ color: grey[900] }}>
                {props.date}
              </Typography>
            </div>
          </Grid>
          <Grid item sm={6} lg={5}>
            <Typography variant="subtitle2" className={classes.statusStyle}>
              {(props.status === "PENDING" && (
                <FaRegClock className={classes.statusIconStyle} />
              )) ||
                (props.status === "TAKEN" && (
                  <FaRegCheckCircle className={classes.statusIconStyle} />
                )) ||
                (props.status === "CANCELLED" && (
                  <BlockIcon className={classes.statusIconStyle} />
                ))}
              {props.status}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.ViewButton}
              startIcon={<IoMdEye style={{ marginLeft: 6 }} />}
              component={Link}
              to={`/interviews/view/${props.id}`}
            >
              View Details
            </Button>
          </Grid>
        </Grid>
        { props.hasAccess && (
          
          <OutsideClickHandler onOutsideClick={closeInterviewMenu}>
            <IconButton onClick={openInterviewMenu}>
              <MoreVertIcon style={MoreIconStyle} />
            </IconButton>
          </OutsideClickHandler>
        )}

        {InterviewMobileMenu}
      </Card>
    </>
  );
};

export default InterviewItems;
