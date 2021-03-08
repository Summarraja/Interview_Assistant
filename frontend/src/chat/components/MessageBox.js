import React from "react";
import Message from "./Message";

import './Message.css';
function MessageBox(props) {

  return (
    <>
      <div className="chats">
                
    {props.chatMessage.map(msg =>(
      <Message 
      oneChatMsgSender = {msg.sender}
      oneChatMsgReceiver = {msg.receiver}
      oneChatMsgContent = {msg.content}
      oneChatMsgTime = {msg.time}
      oneChatMsgRead = {msg.isRead}
      />
        
    ))}
    </div>
       
        
 
    </>
  );
}

export default MessageBox;