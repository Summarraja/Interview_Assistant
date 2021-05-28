import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { Grid, IconButton, Typography } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CallIcon from '@material-ui/icons/Call';
import VideocamIcon from '@material-ui/icons/Videocam';
import './RightTopBar.css';
import { AuthContext } from '../../shared/context/auth-context';
import { useHistory } from 'react-router-dom'

function RightTopBar(props) {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const getImage = () => {
    return (props.selectedChat.from == auth.userId) ? props.selectedChat.withImage : props.selectedChat.fromImage
  }
  return (
    <>
      <Link style={{ textDecoration: 'none', color: '#000000' }} to={`/profile/${(props.selectedChat.from == auth.userId) ? props.selectedChat.with : props.selectedChat.from}`}>
        <div className="avatar-component">

          <Avatar src={'http://localhost:5000/' + getImage()} style={{
            display: "flex",
            alignItems: "center",
            border: '1px solid lightgray',
            margin: "0.5rem",
            width: 50,
            height: 50,
          }}>
          </Avatar>
          <div style={{ margin: "10px" }}>
            <Typography variant="h6" >
              {(props.selectedChat.from == auth.userId) ? props.selectedChat.withName : props.selectedChat.fromName}
            </Typography>
          </div>

        </div>
      </Link>
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