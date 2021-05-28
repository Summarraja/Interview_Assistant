import React, { useContext, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import "./ConversationList.css";
import { AuthContext } from "../../shared/context/auth-context";
const useStyles = makeStyles((theme) => ({

  customBadge: {
    backgroundColor: "#00aa00",
    color: "white"
  },
  Avatar: {
    display: "flex",
    alignItems: "center",
    marginRight: "0.5rem",
    border: '1px solid lightgray',
    width: 60,
    height: 60,
  }
}));

function ConversationList(props) {
  const auth = useContext(AuthContext);
  const classes = useStyles();

  const getMessage = (msg) => {
    if (msg.length > 25) {
      return msg.substring(0, 25) + "..."
    } else {
      return msg
    }
  }
  const getName=()=>{
    return(props.chat.from == auth.userId) ? props.chat.withName : props.chat.fromName
  }
  const getImage=()=>{
    return(props.chat.from == auth.userId) ? props.chat.withImage : props.chat.fromImage
  }
  const getUnread=()=>{
    return(props.chat.from != auth.userId) ? props.chat.withUnread : props.chat.fromUnread
  }
  const getDate = (datetime) => {
    let d = new Date(datetime);
    return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear()
  }
  const getTime = (datetime) => {
    let d = new Date(datetime);
    return d.getHours() + ":" + d.getMinutes();
  }
  const getClass = () => {
    if(getUnread()>0)
    return "unread"
    if (props.selectedChat && props.selectedChat.id == props.chat.id)
      return "selected"
    return "contact-box"
  }
  return (
    <React.Fragment >
      <div className={getClass()} onClick={() => props.setSelectedChat(props.chat)}>
        <div className="avatar-component">
          <Avatar src={'http://localhost:5000/'+getImage()} className={classes.Avatar}>
          </Avatar>
        </div>
        <div className="right-section">
          <div className="contact-box-header">
            <Typography variant="h6" className="avatar-title">{getName()}
            </Typography>
            <span><Badge badgeContent={getUnread()} classes={{ badge: classes.customBadge }}></Badge></span>
            <span className="time-mark">{getDate(props.chat.lastMessageTime)}</span>

          </div>
          <div className="last-msg">
            <Typography className="text" variant="body2" >{getMessage(props.chat.lastMessage)}</Typography >
            <span className="time-mark">{getTime(props.chat.lastMessageTime)}</span>

          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ConversationList;