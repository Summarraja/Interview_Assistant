import React from 'react';
import Chat from '../pages/Chat';


const ChatArrayList = props => {

    return (
        <>
          
                <Chat
                      chatList = {props.items}
                    
                />
        

        </>
    );

};

export default ChatArrayList;