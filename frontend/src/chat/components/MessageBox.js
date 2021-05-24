import React, { useEffect, useRef, useState, useContext } from "react";
import Message from "./Message";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { SocketContext } from "../../shared/context/socket-context";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Message.css';
function MessageBox(props) {
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const socket = useContext(SocketContext);
  // useEffect(()=>{
  //   endDiv.onscroll = function() {
  //     console.log(window.pageYOffset);
  //     if(endDiv.pageYOffset === 0) {
  //       console.log('I AM AT THE TOP');
  //     }
  //   };
  // },[])
  useEffect(() => {
    fetchMessageData();
    markRead();
  }, [props.selectedChat])
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
  const markRead = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/chats/`,
        "POST",
        JSON.stringify({
          uid: auth.userId,
          cid: props.selectedChat.id,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) { }
  };
  const deleteMessage = (msg) => {
    let d = {
      msg,
      token: "Bearer " + auth.token
    }
    socket.emit("deleteMessage", d);
    if (props.messages[props.messages.length - 1].id == msg.id) {
      let chat = props.selectedChat;
      chat.lastMessage = props.messages[props.messages.length - 2].content;
      chat.lastMessageTime = props.messages[props.messages.length - 2].time;
      props.setSelectedChat(chat);
    }
    props.setMessages(props.messages.filter(m => m.id != msg.id));

  }

  const endDiv = useRef(null)
  useEffect(() => {
    endDiv.current.scrollIntoView()
  })
  const scrollHandler = (event) => {
    // console.log(window.innerHeight)
    // console.log(endDiv.current.getBoundingClientRect().bottom)
    // console.log(event.target.scrollHeight)
    if (event.target.scrollTop == 0) {
      console.log("top");
      // fetchMessageData();
    }
    // console.log(event.target.clientHeight)
  }
  return (
    <>
    <LoadingSpinner open={isLoading}/>
      <div className="chats" onScroll={scrollHandler}>

        {props.messages.map((msg, idx) => (
          <Message
            key={idx}
            message={msg}
            deleteMessage={deleteMessage}
          />
        ))}
        <div style={{ float: "right", clear: "both" }} ref={endDiv}> </div>
      </div>
    </>
  );
}

export default MessageBox;