import React, { useEffect, useRef, useContext, useCallback } from "react";
import Message from "./Message";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { SocketContext } from "../../shared/context/socket-context";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Message.css';
function MessageBox({selectedChat,setSelectedChat,messages,setMessages}) {
  const { isLoading, sendRequest } = useHttpClient();
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
  const fetchMessageData = useCallback( async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/messages/chat/${selectedChat.id}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setMessages(responseData.messages)
    } catch (err) { }
  },[auth.token,sendRequest,selectedChat.id,setMessages]);
  const markRead = useCallback( async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/chats/`,
        "POST",
        JSON.stringify({
          uid: auth.userId,
          cid: selectedChat.id,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) { }
  },[auth.token,auth.userId,selectedChat.id,sendRequest]);
  useEffect(() => {
    fetchMessageData();
    markRead();
  }, [selectedChat,fetchMessageData,markRead])
  const deleteMessage = (msg) => {
    let d = {
      msg,
      token: "Bearer " + auth.token
    }
    socket.emit("deleteMessage", d,(error,success)=>{
      console.log(error,success)
    });
    if (messages[messages.length - 1].id === msg.id) {
      let chat = selectedChat;
      chat.lastMessage = messages[messages.length - 2].content;
      chat.lastMessageTime = messages[messages.length - 2].time;
      setSelectedChat(chat);
    }
    setMessages(messages.filter(m => m.id !== msg.id));

  }

  const endDiv = useRef(null)
  useEffect(() => {
    endDiv.current.scrollIntoView()
  })
  const scrollHandler = (event) => {
    // console.log(window.innerHeight)
    // console.log(endDiv.current.getBoundingClientRect().bottom)
    // console.log(event.target.scrollHeight)
    if (event.target.scrollTop === 0) {
      // fetchMessageData();
    }
    // console.log(event.target.clientHeight)
  }
  return (
    <>
    <LoadingSpinner open={isLoading}/>
      <div className="chats" onScroll={scrollHandler}>

        {messages.map((msg, idx) => (
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