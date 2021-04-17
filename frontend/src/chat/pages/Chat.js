
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState, useContext } from "react";
import BottomBar from "../components/BottomBar";
import ChatSearch from "../components/ChatSearch";
import ConversationList from "../components/ConversationList";
import LeftTopBar from "../components/LeftTopBar";
import MessageBox from "../components/MessageBox";
import RightTopBar from "../components/RightTopBar";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Chat.css"


const useStyles = makeStyles((theme) => ({

  aside: {
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
      id: "c1",
      with: "Summar",
      messages: [
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Hello",
          time: "10:00 AM",
          isRead: true,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "Hi",
          time: "10:01 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "How Are You?",
          time: "10:02 AM",
          isRead: true,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time: "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time: "10:10 AM",
          isRead: false,
        },

        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time: "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time: "10:10 AM",
          isRead: false,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time: "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time: "10:10 AM",
          isRead: false,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time: "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time: "10:10 AM",
          isRead: false,
        },
        {
          sender: "Muqaddas",
          receiver: "Summar",
          content: "I am Fine",
          time: "10:05 AM",
          isRead: true,
        },
        {
          sender: "Summar",
          receiver: "Muqaddas",
          content: "Okay.",
          time: "10:10 AM",
          isRead: false,
        },

      ]
    },
    {
      id: "c2",
      with: "Urooj",
      messages: [
        {
          sender: "Urooj",
          receiver: "Muqaddas",
          content: "Hi",
          time: "10:00 AM",
          isRead: true,
        },
        {
          sender: "Muqaddas",
          receiver: "Urooj",
          content: "Hello",
          time: "10:01 AM",
          isRead: true,
        },
        {
          sender: "Urooj",
          receiver: "Muqaddas",
          content: "what are you doing?",
          time: "10:02 AM",
          isRead: true,
        },
        {
          sender: "Muqaddas",
          receiver: "Urooj",
          content: "Nothing",
          time: "10:05 AM",
          isRead: true,
        },
        {
          sender: "Urooj",
          receiver: "Muqaddas",
          content: "Okay.",
          time: "10:10 AM",
          isRead: false,
        },
      ]
    },
  ];

  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const classes = useStyles();
  const [data, setdata] = useState([])
  const [selectedChat, setSelectedChat] = useState({})
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/chats/${auth.userId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setdata(responseData.chats);
      } catch (err) { }
    };
    fetchChats();
  }, []);
  // let messagearr =  [
  //       sender: selectedChat.sender,
  //       receiver: selectedChat.receiver,
  //       content: newMessage,
  //       time : Date.now(),
  //       isRead: true,
  // ];



  function pushMessage() {
    let msg = {
      sender: auth.userId,
      receiver: selectedChat.with,
      content: newMessage,
      time: (new Date()).toDateString(),
      isRead: true,
    }
    // console.log(messages)
    setMessages([...messages,msg])
  }


  return (

    <div className="app">
      <div className={classes.aside} >
        <header>
          <LeftTopBar
            name={auth.resume && auth.resume.firstname + " " + auth.resume.lastname}
          />
        </header>
        <ChatSearch />
        <div className="contact-boxes">
          <ConversationList data={data} setSelectedChat={setSelectedChat} />
        </div>
      </div>
      <div className={classes.mainChat}>
        <header>
          <RightTopBar selectedChat={selectedChat} />
        </header>
        <MessageBox selectedChat={selectedChat} messages={messages} setMessages={setMessages} />
        <BottomBar newMessage={newMessage} setNewMessage={setNewMessage} pushMessage={pushMessage} />
      </div>

    </div>
  );
}
export default Chat;

