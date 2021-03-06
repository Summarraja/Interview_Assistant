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
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

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

  const { isLoading, sendRequest } = useHttpClient();
  const classes = useStyles();
  const [data, setData] = useState();
  const [searchedData, setSearchedData] = useState();
  const [selectedChat, setSelectedChat] = useState()
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState('');
  const[previewUrl,setPreviewUrl]=useState('');

  useEffect(() => {
    socket.on("message", (msg) => {
      if (selectedChat) {
        if (selectedChat.with == msg.sender || selectedChat.with == msg.receiver)
          setMessages([...messages, msg]);
      }
      if (data) {
        fetchChats();
      }
      openChat()
    })
    return () => {
      socket.off("message");
    };
  }, [data, selectedChat, messages]);
  useEffect(() => {

    socket.on("deleteMessage", (msg) => {
      if (selectedChat) {
        if (messages[messages.length - 1].id == msg.id) {
          let chat = selectedChat;
          chat.lastMessage = messages[messages.length - 2].content?messages[messages.length - 2].content:'image';
          chat.lastMessageTime = messages[messages.length - 2].time;
          setSelectedChat(chat);
        }
        setMessages(messages.filter(m => m.id != msg.id));
      } else {
        fetchChats();
      }
    })
    return () => {
      socket.off("deleteMessage");
    };
  }, [messages, selectedChat]);

  useEffect(() => {
    fetchChats();
  }, [])
  const openChat = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/settings/openChat/${auth.userId}`,
        "PATCH",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) { }
  }
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
      setData(responseData.chats);
    } catch (err) { }
  };
  function pushMessage() {
    if (!(/^ *$/.test(newMessage)) || file) {
      let message = {
        sender: auth.userId,
        receiver: (selectedChat.with == auth.userId) ? selectedChat.from : selectedChat.with,
        content: newMessage,
        time: (new Date()).toISOString(),
        chat: selectedChat.id,
      }
      let d = {
        message,
        file:file,
        fileName:file.name,
        previewUrl:previewUrl,
        token: "Bearer " + auth.token
      }
      socket.emit("message", d,(error,success)=>{
        console.log(error,success)
      });
      setNewMessage('');
      setPreviewUrl('');
      setFile('');
      let msg={
        ...message,
        previewUrl
      };
      setMessages([...messages, msg]);
      if (data) {
        let index;
        data.forEach(chat => {
          if (chat.id == msg.chat) {
            index = data.indexOf(chat);
          }
        });
        if (index > -1) {
          data[index].lastMessage = msg.content?msg.content:'image';
          data[index].lastMessageTime = msg.time;
          if (data[index].from != auth.userId)
            data[index].withUnread = 0;
          else
            data[index].fromUnread = 0;
          setData(data)

        }
      }
    }
  }

  return (
    <div className="app">
      <LoadingSpinner open={isLoading}/>
      <div className={classes.aside} >
        <header>
          <LeftTopBar
            name={auth.resume && auth.resume.fullname}
          />
        </header>
        <ChatSearch data={data} setSearchedData={setSearchedData} />
        <div className="contact-boxes">
          <ConversationList  data={data} setData={setData} searchedData={searchedData} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        </div>
      </div>
      <div className={classes.mainChat}>
        <header>
          {selectedChat != null && (<RightTopBar selectedChat={selectedChat} />)}
        </header>

        {selectedChat != null && (<MessageBox selectedChat={selectedChat} setSelectedChat={setSelectedChat} messages={messages} setMessages={setMessages} />)}
        {selectedChat != null && (<BottomBar newMessage={newMessage} setNewMessage={setNewMessage} pushMessage={pushMessage} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} file={file} setFile={setFile}/>)}

      </div>

    </div>
  );
}
export default Chat;

