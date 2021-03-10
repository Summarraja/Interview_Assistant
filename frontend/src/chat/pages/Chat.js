
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


function Chat() {


  const ChatUsers = [
    {
      id:"c1",
      with: "Summar",
      messages: [
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Hello",
          time : "10:00 AM",
          isRead: true,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "Hi",
          time : "10:01 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "How Are You?",
          time : "10:02 AM",
          isRead: true,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time : "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time : "10:10 AM",
          isRead: false,
        },
  
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time : "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time : "10:10 AM",
          isRead: false,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time : "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time : "10:10 AM",
          isRead: false,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time : "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time : "10:10 AM",
          isRead: false,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time : "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time : "10:10 AM",
          isRead: false,
        },
    
      ]
    },
    {
      id:"c2",
      with: "Urooj",
      messages: [
        {
          sender: "Urooj",
          receiver: "Muqaddas",
          content: "Hi",
          time : "10:00 AM",
          isRead: true,
        },
        {
          sender: "Muqaddas",
          receiver: "Urooj",
          content: "Hello",
          time : "10:01 AM",
          isRead: true,
        },
        {
          sender: "Urooj",
          receiver: "Muqaddas",
          content: "what are you doing?",
          time : "10:02 AM",
          isRead: true,
        },
        {
          sender: "Muqaddas",
          receiver: "Urooj",
          content: "Nothing",
          time : "10:05 AM",
          isRead: true,
        },
        {
          sender: "Urooj",
          receiver: "Muqaddas",
          content: "Okay.",
          time : "10:10 AM",
          isRead: false,
        },
      ]
    },
  ];


const classes = useStyles();
const [data, setdata]=useState(ChatUsers)
const [contactSelected, setcontactSelected]=useState({})
const [currentMessages, setCurrentMessages] = useState([])
const [Newmessage, setNewmessage]= useState('')

// console.log(contactSelected)
useEffect(()=>{
  const currentContact= data.find(d=>d.id===contactSelected.id)
  setCurrentMessages((currentContact && currentContact.messages)|| [])
},[contactSelected, data])

// let messagearr =  [
//       sender: contactSelected.sender,
//       receiver: contactSelected.receiver,
//       content: Newmessage,
//       time : Date.now(),
//       isRead: true,
// ];

let messagesObject = [
  {
    sender: contactSelected.sender,
          receiver: contactSelected.receiver,
          content: Newmessage,
          time : Date.now(),
          isRead: true,
  },
];

console.log("sendERRRR  "+contactSelected);
// function pushMessages(){
// const index = data.find(d=>d.id===contactSelected.id)
// console.log(index)
// // const newdata= Object.assign([], data, {
// //   [index]:{
// // ChatUsers: contactSelected,
// // messages: [...data[index].messages, messagearr]

//   // },
// }
// setdata(newdata)
// }

console.log(currentMessages)






  return (
    
   <div className="app">
     <div className={classes.aside} >
           <header>
         <LeftTopBar/>
           </header>
           <ChatSearch/>
           <div className="contact-boxes">

        
            <ConversationList data ={data} setcontactSelected={setcontactSelected}              
            />   
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
          <BottomBar Newmessage={Newmessage} setNewmessage={setNewmessage}  />
             </div>
             
    </div>
  
  );
}
export default Chat;

