import React, { useContext, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Grid, IconButton, Typography } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CallIcon from '@material-ui/icons/Call';
import VideocamIcon from '@material-ui/icons/Videocam';
import './RightTopBar.css';
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

function RightTopBar(props) {
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${props.selectedChat.with}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setUsername(responseData.name)
      } catch (err) { }
    };
    if (props.selectedChat.with)
      fetchUserData();
  }, [props.selectedChat])

  return (
    <>
      <div className="avatar-component">

        <Avatar src={'http://localhost:5000/uploads/images/image.png'}>
        </Avatar>
        <div style={{ margin: "10px" }}>
          <Typography variant="h6" >
            {username}
          </Typography>
        </div>

      </div>
      <div style={{ float: "right" }}>
        <IconButton
        >
          <CallIcon color="primary" />
        </IconButton>
        <IconButton
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