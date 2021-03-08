import React from "react";
import ChatArrayList from "./ChatArrayList";


const ChatArray = () => {
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
  return(
     <>
  <ChatArrayList items={ChatUsers}
  
  />
  {console.log(ChatUsers.length)}
  </>
  );
};

export default ChatArray;
