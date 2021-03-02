import React from "react";
import ChatSearch from "./ChatSearch";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import "./ConversationList.css";
import Divider from '@material-ui/core/Divider';


function ConversationList() {

  return (
    <>



      <div className="contact-box">
        <div className="avatar-component">
          <Avatar style={{ height: "50px", width: "50px", marginRight: "10px" }}
            src="data:image/png;base64,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"
            alt="">
          </Avatar>
        </div>

        <div className="right-section">
          <div className="contact-box-header">
            <Typography variant="h6" className="avatar-title">Summar Raja</Typography>
            <span className="time-mark">yesterday</span>
          </div>
          <div className="last-msg">
            <Typography className="text">Hello ! How are you!!</Typography>
          </div>
        </div>
      </div>


      <div className="contact-box">
        <div className="avatar-component">
          <Avatar style={{ height: "50px", width: "50px", marginRight: "10px" }}
           src="https://media.istockphoto.com/vectors/girl-in-a-hijab-young-arab-business-woman-female-portrait-vector-id1273238550?k=6&m=1273238550&s=612x612&w=0&h=TkssDjmcvM0L2sLYobE3TvEZxRkSHxqTtIa3D_f2uZo= "
            alt="">
          </Avatar>
        </div>

        <div className="right-section">
          <div className="contact-box-header">
            <Typography variant="h6" className="avatar-title">Urooj Tahir</Typography>
            <span className="time-mark">yesterday</span>
          </div>
          <div className="last-msg">
            <Typography className="text">Hi</Typography>
          </div>
        </div>
      </div>


      <div className="contact-box">
        <div className="avatar-component">
          <Avatar style={{ height: "50px", width: "50px", marginRight: "10px" }}
           src="data:image/png;base64,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"
            alt="">
          </Avatar>
        </div>

        <div className="right-section">
          <div className="contact-box-header">
            <Typography variant="h6" className="avatar-title">Ali Hassan</Typography>
            <span className="time-mark">yesterday</span>
          </div>
          <div className="last-msg">
            <Typography className="text">Excuse me</Typography>
          </div>
        </div>
      </div>



      <div className="contact-box">
        <div className="avatar-component">
          <Avatar style={{ height: "50px", width: "50px", marginRight: "10px" }}
            src="data:image/jpeg;base64,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"
            alt="">
          </Avatar>
        </div>

        <div className="right-section">
          <div className="contact-box-header">
            <Typography variant="h6" className="avatar-title">Sara Khan</Typography>
            <span className="time-mark">yesterday</span>
          </div>
          <div className="last-msg">
            <Typography className="text">Hey Listen!</Typography>
          </div>
        </div>
      </div>
     
    </>
  );
}

export default ConversationList;