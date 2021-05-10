import React, { useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Grid, IconButton, Typography } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
import './LeftTopBar.css';
import {AuthContext} from '../../shared/context/auth-context';

function LeftTopBar(props) {
  const auth = useContext(AuthContext);
  return (
    <>
      <div className="avatar-component">

        <Avatar
          src={"http://localhost:5000/" + auth.resume.image}
          >
        </Avatar>
        <div style={{ margin: "10px" }}>
          <Typography variant="h6" >
            {props.name}
          </Typography>
        </div>


      </div>
      <div style={{ float: "right" }}>
        <IconButton
        >
          <MoreVertIcon color="primary" />
        </IconButton>
      </div>
    </>
  );

}
export default LeftTopBar;