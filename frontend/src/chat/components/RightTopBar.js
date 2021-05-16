import React, { useContext, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Grid, IconButton, Typography } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CallIcon from '@material-ui/icons/Call';
import VideocamIcon from '@material-ui/icons/Videocam';
import './RightTopBar.css';
import { AuthContext } from '../../shared/context/auth-context';
import { Redirect } from 'react-router'
import { useHistory } from 'react-router-dom'

function RightTopBar(props) {
  const auth = useContext(AuthContext);
  const history = useHistory();
  return (
    <>
      <div className="avatar-component">

        <Avatar src={'http://localhost:5000/uploads/images/image.png'}>
        </Avatar>
        <div style={{ margin: "10px" }}>
          <Typography variant="h6" >
            {(props.selectedChat.from == auth.userId) ? props.selectedChat.withName : props.selectedChat.fromName}
          </Typography>
        </div>

      </div>
      <div style={{ float: "right" }}>
        <IconButton onClick={() => {
          history.push({
            pathname: '/videocall',
            state: { to: (props.selectedChat.from == auth.userId) ? props.selectedChat.with : props.selectedChat.from, type: "audio" }
          });
        }} >
          <CallIcon color="primary" />
        </IconButton>
        <IconButton onClick={() => {
          history.push({
            pathname: '/videocall',
            state: { to: (props.selectedChat.from == auth.userId) ? props.selectedChat.with : props.selectedChat.from, type: "video" }
          });
        }}>
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