import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, Divider } from "@material-ui/core";
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

import {Link} from "react-router-dom";
import BlockIcon from "@material-ui/icons/Block";


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
      display: "none",
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

const CertificateItem = (props) => {

  const classes = useStyles();
  return (
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
          <Typography
            variant="subtitle2"
            //  color="#fff"
            className={classes.statusStyle}
          >
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
           to="/interview/view"
          >
            View Details
          </Button>
         
        
    
        </Grid>
      </Grid>
      {/* <OutsideClickHandler onOutsideClick={closeInterviewMenu}>
        <IconButton onClick={openInterviewMenu}>
          <MoreVertIcon style={MoreIconStyle} />
        </IconButton>
      </OutsideClickHandler> */}
      {/* {InterviewMobileMenu} */}
    
    </Card>
  );
};

export default CertificateItem;
