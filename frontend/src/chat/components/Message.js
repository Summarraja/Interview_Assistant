import React,{useContext} from "react";
import './Message.css';
import { AuthContext } from "../../shared/context/auth-context";

function Message(props) {
    const auth = useContext(AuthContext);
    return (
        <>
                <div className={props.message.sender !== auth.userId?"message sent" : "message received"}>
                    {props.message.content}
                    <div className="metadata">
                        <span className="date">{props.message.time}</span>
                    </div>
                </div>
               




        </>
    );
}

export default Message;