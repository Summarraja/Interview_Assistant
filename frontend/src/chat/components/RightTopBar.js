import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Grid, IconButton, Typography } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CallIcon from '@material-ui/icons/Call';
import VideocamIcon from '@material-ui/icons/Videocam';
 import './RightTopBar.css';


 function RightTopBar() {

  
  return (
<>

    <div className="avatar-component">

    <Avatar
        src="https://media.istockphoto.com/vectors/girl-in-a-hijab-young-arab-business-woman-female-portrait-vector-id1273238550?k=6&m=1273238550&s=612x612&w=0&h=TkssDjmcvM0L2sLYobE3TvEZxRkSHxqTtIa3D_f2uZo= "
        alt="">  
        </Avatar>
        <div style={{margin:"10px"}}>
      <Typography variant="h6" >
     Urooj Tahir
     </Typography>
     </div>
     

</div>
<div style={{float:"right"}}>
         
   
          <IconButton
            >
              <CallIcon color="primary"/>
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