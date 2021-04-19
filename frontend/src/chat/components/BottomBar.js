import React, { useState, useRef } from "react";
import { IconButton } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import Picker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import './BottomBar.css';

function BottomBar({ newMessage, setNewMessage, pushMessage }) {
  const [open, setOpen] = useState(false);
  const emojiRef1 = useRef();
  const emojiRef2 = useRef();
  const emojiRef3 = useRef();
  function handleClickOutside(event) {

    if (emojiRef1.current && emojiRef2.current && emojiRef3.current) {
      if (!emojiRef1.current.contains(event.target) && !emojiRef2.current.contains(event.target) && !emojiRef3.current.contains(event.target)) {
        setOpen(false);
      }
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };
  return (
    <>
      {(open) && <div className='Blink' ref={emojiRef1}><Picker onEmojiClick={onEmojiClick} /></div>}
      <div className="chat-input-box">
        <div >
          <IconButton ref={emojiRef2} onClick={() => { setOpen(!open) }}>
            <EmojiEmotionsIcon color="primary" />

          </IconButton>
        </div>

        <div className="chat-input" ref={emojiRef3}>
          <input type="text" placeholder="Type a message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />

          {/* <input type="text" placeholder="Type a message" value ={newMessage}onChange={(e)=>{setNewMessage(e.target.value)}}/> */}
        </div>

        <div >
          <IconButton onClick={pushMessage}>
            <SendIcon color="primary" />
          </IconButton>
        </div>
      </div>
    </>
  );
}

export default BottomBar;