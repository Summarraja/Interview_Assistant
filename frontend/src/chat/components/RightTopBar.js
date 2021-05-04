import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Grid, IconButton, Typography } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CallIcon from '@material-ui/icons/Call';
import VideocamIcon from '@material-ui/icons/Videocam';
import './RightTopBar.css';
import { Link } from "react-router-dom";





 function RightTopBar(props) {

  

  return (
<>

    <div className="avatar-component">

    <Avatar>  
        </Avatar>
        <div style={{margin:"10px"}}>
      <Typography variant="h6" >
     {props.user.with}
     </Typography>
     </div>
     

</div>
<div style={{float:"right"}}>
         <Grid align="center"> 
 
          <IconButton
            >
              <CallIcon color="primary" />
            </IconButton>
    
             <IconButton component={Link} to="/videocall">
            
              <VideocamIcon color="primary" />
            </IconButton>

            <IconButton
            >
              <MoreVertIcon color="primary" />
            </IconButton>

            </Grid>
     </div>
</>
  );

  }
export default RightTopBar;