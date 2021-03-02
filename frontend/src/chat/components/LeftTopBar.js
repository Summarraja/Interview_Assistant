import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Grid, IconButton, Typography } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
 import './LeftTopBar.css';


 function LeftTopBar() {

  
  return (
<>

    <div className="avatar-component">

    <Avatar
        src="https://st3.depositphotos.com/6697918/15699/v/380/depositphotos_156996594-stock-illustration-beautiful-muslim-arab-woman-in.jpg "
        alt="">  
        </Avatar>
        <div style={{margin:"10px"}}>
      <Typography variant="h6" >
        Muqaddas
     </Typography>
     </div>
     

</div>
<div style={{float:"right"}}>
          <IconButton
            >
              <MoreVertIcon color="primary"/>
            </IconButton>
     </div>
</>
  );

  }
export default LeftTopBar;