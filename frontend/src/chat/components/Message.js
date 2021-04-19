import React,{useContext} from "react";
import './Message.css';
import { AuthContext } from "../../shared/context/auth-context";

function Message(props) {
    const getDate = (datetime) => {
        let d = new Date(datetime);
        return d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear()
      }
      const getTime = (datetime) => {
        let d = new Date(datetime);
        return d.getHours() + ":" + d.getMinutes();
      }
    const auth = useContext(AuthContext);
    return (
        <>
                <div className={props.message.sender !== auth.userId?"message sent" : "message received"}>
                    {props.message.content}
                    <div className="metadata">
                        <span className="date">{getTime(props.message.time) +" "+ getDate(props.message.time)}</span>
                    </div>
                </div>
               




        </>
    );
}

export default Message;