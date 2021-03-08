
import { Divider, Grid, Paper, Typography, } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import BottomBar from "../components/BottomBar";
import ChatSearch from "../components/ChatSearch";
import ConversationList from "../components/ConversationList";
import LeftTopBar from "../components/LeftTopBar";
import MessageBox from "../components/MessageBox";
import RightTopBar from "../components/RightTopBar";


import "./Chat.css"


const useStyles = makeStyles((theme) => ({

  aside : {
  //  width: "25%",
    display: "flex",
    flexDirection: "column",
    marginLeft: "60px",
    background: "#fff",
    [theme.breakpoints.up("xs")]: {
     width: "50%",
     marginLeft: 0,
      marginTop: 65
    },
    [theme.breakpoints.up("sm")]: {
      width: "40%",
      marginLeft: 60
     
    },
    [theme.breakpoints.up("md")]: {
      width: "25%",
      marginLeft: 60
     
    },
  },
  
  mainChat: {
   // width: "75%",
    background: "#d3d3d3",
    display: "flex",
    flexDirection: "column",
    backgroundSize: "contain",
    [theme.breakpoints.up("xs")]: {
      width: "50%",
      marginTop: 65
    
    },
    [theme.breakpoints.up("sm")]: {
      width: "60%",
    
    },
    [theme.breakpoints.up("md")]: {
      width: "75%",
      
    
    },
  
  }
}));


function Chat(props) {
const classes = useStyles();

const [data, setdata]=useState(props.chatList)
const [contactSelected, setcontactSelected]=useState({})
const [currentMessages, setCurrentMessages] = useState([])

useEffect(()=>{
  const currentContact= data.find(d=>d.id===contactSelected.id)
  setCurrentMessages((currentContact && currentContact.messages)|| [])
},[contactSelected, data])

console.log(currentMessages)

  return (
    
   <div className="app">
     <div className={classes.aside} >
           <header>
         <LeftTopBar/>
           </header>
           <ChatSearch/>
           <div className="contact-boxes">
         
       {data.map(chat=>(
            <ConversationList
               contact ={chat} key={chat.id} setcontactSelected={setcontactSelected}
            />
       ))}        
           </div>
           </div>
             <div className={classes.mainChat}>
           <header>
         <RightTopBar user={contactSelected}         
         />
           </header>
        
          <MessageBox
            chatMessage = {currentMessages}
               />
          <BottomBar/>
             </div>
             
    </div>
  
  );
}


export default Chat;

