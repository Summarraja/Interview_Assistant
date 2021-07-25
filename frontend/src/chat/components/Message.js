import React, { useContext } from "react";
import DeleteIcon from '@material-ui/icons/Delete';
import './Message.css';
import { AuthContext } from "../../shared/context/auth-context";

function Message(props) {
    const getDate = (datetime) => {
        let d = new Date(datetime);
        return d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear()
    }
    const getTime = (datetime) => {
        let d = new Date(datetime);
        return d.getHours() + ":" + d.getMinutes();
    }
    const auth = useContext(AuthContext);
    return (
        <>
            <div className={props.message.sender !== auth.userId ? "message sent" : "message received"}>
                {props.message.file && (<img className={"image"} src={process.env.REACT_APP_BACKEND_ASSET_URL+props.message.file} alt="msg-img" />)}
                {props.message.previewUrl && (<img className={"image"} src={props.message.previewUrl} alt = "msg-img"/>)}
                {props.message.content}
                <div className="metadata">
                    <span className="date">{getTime(props.message.time) + " " + getDate(props.message.time)}</span>

                </div>
            <div className={'button-delete'} onClick={()=>{props.deleteMessage(props.message)}} ><DeleteIcon color={'error'} /></div>
            </div>
        </>
    );
}

export default Message;