import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import './BottomBar.css';

 function BottomBar({Newmessage, setNewmessage, pushMessages}) {
//  const [newMessage,setNewMessage]=useState('');
//  const sendMessage=()=>{
//    let message =  {
//     sender: "",
//     receiver: "",
//     content: newMessage,
//     time : "",
//     isRead: true,
//   };
//   console.log(props.currentMessages)
//   props.setCurrentMessages(...props.currentMessages.messages,message);
  

 
  return (
    <>
    <div className="chat-input-box">
                    <div >
                    <IconButton>
                      <EmojiEmotionsIcon color="primary" />
                    </IconButton>
                    </div>

                    <div className="chat-input">
                    <input type="text" placeholder="Type a message" value={Newmessage} onChange={(e)=>setNewmessage(e.target.value)}/>

                        {/* <input type="text" placeholder="Type a message" value ={newMessage}onChange={(e)=>{setNewMessage(e.target.value)}}/> */}
                    </div>

                    <div >
                    <IconButton>
                      <SendIcon color="primary" onClick={pushMessages}/>
                    </IconButton>
                    </div>
                </div>
  </>
  );
}

export default BottomBar;