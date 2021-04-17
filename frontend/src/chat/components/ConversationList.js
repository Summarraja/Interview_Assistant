import React, { useContext, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import "./ConversationList.css";
import ConversationListItem from './ConversationListItem';
import { Paper } from "@material-ui/core";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

function ConversationList({ data, setSelectedChat }) {
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
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
        <ConversationListItem key={chat.id} uid = {chat.with} mid={chat.lastMessageId} setSelectedChat={setSelectedChat} chat={chat}/>
      ))}



    </>
  );
}

export default ConversationList;