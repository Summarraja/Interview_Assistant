import React, { useContext, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import "./ConversationList.css";
import ConversationListItem from './ConversationListItem';
import { Paper } from "@material-ui/core";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

function ConversationList({ data,setData, searchedData,selectedChat, setSelectedChat }) {
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (selectedChat) {
      let index = data.indexOf(selectedChat);
      if (index > -1) {
        if (data[index].from != auth.userId)
          data[index].withUnread = 0;
        else
          data[index].fromUnread = 0;
          setData(data)
      }
    }
  }, [selectedChat,data])

  if (searchedData) {
    return (
      <>
      {searchedData.map(chat => (
        <ConversationListItem key={chat.id} selectedChat={selectedChat} setSelectedChat={setSelectedChat} chat={chat} />
      ))}
    </>
    );
  }
  if (!data) {
    return (
      <Typography variant="h5" color="primary" align="center" style={{ marginTop: "200px" }}>
        Loading Chats..
      </Typography>
    );
  }
  if (data.length === 0) {
    return (
      <Typography variant="h5" color="primary" align="center" style={{ marginTop: "200px" }}>
        No Chats Available
      </Typography>
    );
  }
  return (
    <>
      {data.map(chat => (
        <ConversationListItem key={chat.id} selectedChat={selectedChat} setSelectedChat={setSelectedChat} chat={chat} />
      ))}
    </>
  );
}

export default ConversationList;