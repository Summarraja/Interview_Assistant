import React, { useState, useRef } from "react";
import { IconButton } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import Picker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import UploadPhoto from './UploadPhoto'
import './BottomBar.css';

function BottomBar({ newMessage, setNewMessage, pushMessage,previewUrl,setPreviewUrl,file,setFile }) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const emojiRef1 = useRef();
  const emojiRef2 = useRef();
  const emojiRef3 = useRef();

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    console.log("close")
    setOpen(false);
  };
  function handleClickOutside(event) {

    if (emojiRef1.current && emojiRef2.current && emojiRef3.current) {
      if (!emojiRef1.current.contains(event.target) && !emojiRef2.current.contains(event.target) && !emojiRef3.current.contains(event.target)) {
        setEmojiOpen(false);
      }
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };
  return (
    <>
      {(emojiOpen) && <div className='Blink' ref={emojiRef1}><Picker onEmojiClick={onEmojiClick} /></div>}
      <div className="chat-input-box">
        <div >
          <IconButton ref={emojiRef2} onClick={() => { setEmojiOpen(!emojiOpen) }}>
            <EmojiEmotionsIcon color="primary" />

          </IconButton>
        </div>

        <div className="chat-input" ref={emojiRef3}>
          <input type="text" placeholder="Type a message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />

        </div>

        <div >
          <IconButton onClick={handleOpenDialog}>
          <PhotoCameraIcon style={{ width: "30px", height: "40px" }} />
          </IconButton>
          {open && (
                <UploadPhoto
                  open={open}
                  handleCloseDialog={handleCloseDialog}
                  setOpen={setOpen}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  file={file}
                  setFile={setFile}
                  setPreviewUrl={setPreviewUrl}
                  previewUrl={previewUrl}
                  pushMessage={pushMessage}
                />
              )}
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