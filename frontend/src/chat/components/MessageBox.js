import React, { useEffect, useRef, useState, useContext } from "react";
import Message from "./Message";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import './Message.css';
function MessageBox(props) {
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  useEffect(() => {

    const fetchMessageData = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/messages/chat/${props.selectedChat.id}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        props.setMessages(responseData.messages)
      } catch (err) { }
    };
    if (props.selectedChat.id)
      fetchMessageData();
  }, [props.selectedChat])

  const endDiv = useRef(null)
  useEffect(() => {
    endDiv.current.scrollIntoView()
  })

  return (
    <>
      <div className="chats">

        {props.messages.map((msg,idx) => (
          <Message
            key={idx}
            message={msg}
          />
        ))}
        <div style={{ float: "right", clear: "both" }} ref={endDiv}> </div>
      </div>
    </>
  );
}

export default MessageBox;