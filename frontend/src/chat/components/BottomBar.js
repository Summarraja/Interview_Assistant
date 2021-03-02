import React from "react";
import { IconButton } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import './BottomBar.css';

 function BottomBar() {
 
  return (
    <>
    <div className="chat-input-box">
                    <div >
                    <IconButton>
                      <EmojiEmotionsIcon color="primary" />
                    </IconButton>
                    </div>

                    <div className="chat-input">
                        <input type="text" placeholder="Type a message" />
                    </div>

                    <div >
                    <IconButton>
                      <SendIcon color="primary" />
                    </IconButton>
                    </div>
                </div>
  </>
  );
}

export default BottomBar;