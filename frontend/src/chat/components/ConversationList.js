import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import "./ConversationList.css";
import { Paper } from "@material-ui/core";



function ConversationList({data, setcontactSelected}) {


  if (data.length === 0) {
    return(
       
          <Typography variant="h5" color="primary" align="center" style={{marginTop:"200px"}}>
            No Chats Available
          </Typography>
    );
  }

  return (
    <>
     {data.map(chat=>(

           <div className="contact-box" onClick={()=>setcontactSelected(chat)}>
           <div className="avatar-component">
             <Avatar style={{ height: "50px", width: "50px", marginRight: "10px" }}>        
             </Avatar>
           </div>
       
           <div className="right-section">
              <div className="contact-box-header">
        
               <Typography variant="h6" className="avatar-title">{chat.with}</Typography>
           
                <span className="time-mark">yesterday</span>
              </div>
              <div className="last-msg">
                <Typography className="text" variant="body2" >Hello ! How are you!!</Typography >
              </div>
            </div>
          </div> 
     
        
        ))}         

     

    </>
  );
}

export default ConversationList;