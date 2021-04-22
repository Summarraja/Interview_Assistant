import React, { useContext, useEffect, useState } from "react";
import UserItem from "./UserItem";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  return (
    <>
      {!isLoading ? (
        <UserItem
          resume={ props.userResume.user ? props.userResume : auth.resume }
          approvedCertCount={props.approvedCertCount}
          userInter={props.userInterviews}
          userSett = {props.userSetting}
          otherUser = {props.otherUser}
        />
      ) : (
        <LoadingSpinner open={isLoading} />
      )}
    </>
  );
};

export default Users;
