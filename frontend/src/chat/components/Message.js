import React from "react";
import './Message.css';

function Message(props) {
const MyID = "muqs"
    return (
        <>
                <div className={props.message.sender === "Muqaddas"?"message sent" : "message received"}>
                    {props.message.content}
                    <div className="metadata">
                        <span className="date">{props.message.date}</span>
                    </div>
                </div>
               




        </>
    );
}

export default Message;