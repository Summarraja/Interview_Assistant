import React from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Grid } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import CallIcon from "@material-ui/icons/Call";
import VideocamIcon from "@material-ui/icons/Videocam";
import Button from "@material-ui/core/Button";
import "./UserItem.css";
import WorkIcon from "@material-ui/icons/Work";
import Paper from "@material-ui/core/Paper";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  Avatar: {
    display: "flex",
    alignItems: "center",
    margin: "auto",
    width: 150,
    height: 150,
    transform: "translate(0px, 65px)",
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
  const classes = useStyles();

  const RTCiconStyle = {
    margin: "15px",
    color: "#004777",
    fontSize: "2rem",
  };

  const resumeButtonStyle = {
    minWidth: "160px",
    minHeight: "40px",
    margin: "10px 8px ",
    alignItems: "center",
  };

  const divstyle = {
    textAlign: "center",
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
      <Paper elevation={10} className={classes.paperStyle}>
        <div style={topBorder}>
          <Avatar
            className={classes.Avatar}
            alt={props.name}
            src={props.image}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 70 }}>
          <Typography variant="h4">{props.name}</Typography>
          <Grid align="center">
            <IconButton>
              <ChatIcon style={RTCiconStyle} />
            </IconButton>
            <IconButton>
              <CallIcon style={RTCiconStyle} />
            </IconButton>
            <IconButton>
              <VideocamIcon style={RTCiconStyle} />
            </IconButton>
          </Grid>
        </div>
        <div style={divstyle}>
          <Typography variant="subtitle1">
            <WorkIcon style={divIconStyle} /> {props.profession}
          </Typography>

          <Typography variant="subtitle1">
            <LocationOnIcon style={divIconStyle} /> From {props.city},{" "}
            {props.country}
          </Typography>
        </div>

        <Accordion style={accordStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading} align="justify">
              My Interviews
            </Typography>
          </AccordionSummary>
          <AccordionDetails lg={12} md={6}>
            <Typography style={typoStyle}>
              {props.interviewCount}{" "}
              {props.interviewCount === 1 ? "Interview" : "Interviews"}
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
            >
              View Interviews
            </Button>

          </AccordionDetails>
        </Accordion>

        <Accordion style={accordStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
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
                {props.certificateCount}{" "}
                {props.certificateCount === 1 ? "Certificate" : "Certificates"}
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                component= {Link}
                to = "/certificates"
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
            size="small"
            style={resumeButtonStyle}
          >
            My Resumes
          </Button>
        </Grid>
      </Paper>
    </>
  );
};

export default UserItem;
