
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState, useContext } from "react";
import BottomBar from "../components/BottomBar";
import ChatSearch from "../components/ChatSearch";
import ConversationList from "../components/ConversationList";
import LeftTopBar from "../components/LeftTopBar";
import MessageBox from "../components/MessageBox";
import RightTopBar from "../components/RightTopBar";
import { AuthContext } from "../../shared/context/auth-context";
import { SocketContext } from "../../shared/context/socket-context";
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

  const auth = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const classes = useStyles();
  const [data, setdata] = useState()
  const [selectedChat, setSelectedChat] = useState()
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('')
  socket.on("message", (msg) => {
    if (selectedChat)
      setMessages([...messages, msg]);
  })
  useEffect(() => {
    return () => {
      socket.off("SENDING_NEW_TIME");
    };
  }, []);
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


  function pushMessage() {
    let msg = {
      sender: auth.userId,
      receiver: (selectedChat.with == auth.userId) ? selectedChat.from : selectedChat.with,
      content: newMessage,
      time: (new Date()).toISOString(),
      isRead: true,
      chat: selectedChat.id,
      token: "Bearer " + auth.token
    }
    setNewMessage('');
    setMessages([...messages, msg]);
    socket.emit("message", msg);
  }


  return (

    <div className="app">
      <div className={classes.aside} >
        <header>
          <LeftTopBar
            name={auth.resume && auth.resume.fullname}
          />
        </header>
        <ChatSearch />
        <div className="contact-boxes">
          <ConversationList data={data} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        </div>
      </div>
      <div className={classes.mainChat}>
        <header>
          {selectedChat != null && (<RightTopBar selectedChat={selectedChat} />)}
        </header>

        {selectedChat != null && (<MessageBox selectedChat={selectedChat} messages={messages} setMessages={setMessages} />)}
        {selectedChat != null && (<BottomBar newMessage={newMessage} setNewMessage={setNewMessage} pushMessage={pushMessage} />)}

      </div>

    </div>
  );
}
export default Chat;

