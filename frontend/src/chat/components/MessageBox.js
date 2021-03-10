import React, { useEffect, useRef } from "react";
import Message from "./Message";

import './Message.css';
function MessageBox(props) {
const endDiv= useRef(null)
useEffect(()=>{
endDiv.current.scrollIntoView()
})

  return (
    <>
      <div className="chats">
                
    {props.chatMessage.map(msg =>(
      <Message 
       message={msg}
      />       
    ))}
    <div style={{float:"right", clear:"both"}} ref={endDiv}> </div>
    </div>
    </>
  );
}

export default MessageBox;