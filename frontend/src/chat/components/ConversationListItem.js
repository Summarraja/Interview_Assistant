import React, { useContext, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import "./ConversationList.css";
import { Paper } from "@material-ui/core";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

function ConversationList(props) {
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState();
  const [message, setMessage] = useState();
  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/users/${props.uid}`,
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
      const fetchMessageData = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/messages/${props.mid}`,
            "GET",
            null,
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          setMessage(responseData.message)
        } catch (err) { }
      };
      fetchUserData();
      fetchMessageData();
  }, [])


  const getDay = () => {
    return "yester"
  }

  return (
        <React.Fragment >
          <div className="contact-box" onClick={() => props.setSelectedChat(props.chat)}>
            <div className="avatar-component">
              <Avatar src={'http://localhost:5000/uploads/images/image.png'} style={{ height: "50px", width: "50px", marginRight: "10px" }}>
              </Avatar>
            </div>
            <div className="right-section">
              <div className="contact-box-header">
                <Typography variant="h6" className="avatar-title">{username}</Typography>

                <span className="time-mark">{getDay()}</span>
              </div>
              <div className="last-msg">
                <Typography className="text" variant="body2" >{(message )&& message.content}</Typography >
              </div>
            </div>
          </div>
        </React.Fragment>
  );
}

export default ConversationList;