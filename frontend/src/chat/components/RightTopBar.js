import React, { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { Grid, IconButton, Typography } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CallIcon from '@material-ui/icons/Call';
import VideocamIcon from '@material-ui/icons/Videocam';
import './RightTopBar.css';
import {AuthContext} from '../../shared/context/auth-context';

function RightTopBar(props) {
  const auth = useContext(AuthContext);

  return (
    <>
      <div className="avatar-component">

        <Avatar src={'http://localhost:5000/uploads/images/image.png'}>
        </Avatar>
        <div style={{ margin: "10px" }}>
          <Typography variant="h6" >
            { (props.selectedChat.from==auth.userId)? props.selectedChat.withName:props.selectedChat.fromName}
          </Typography>
        </div>

      </div>
      <div style={{ float: "right" }}>
        <IconButton
        >
          <CallIcon color="primary" />
        </IconButton>
        <IconButton
        component = {Link}
        to ="/videocall"
        >
          <VideocamIcon color="primary" />
        </IconButton>

        <IconButton
        >
          <MoreVertIcon color="primary" />
        </IconButton>
      </div>
    </>
  );

}
export default RightTopBar;