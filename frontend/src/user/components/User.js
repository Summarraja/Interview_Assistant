import React, { useContext, useEffect, useState } from "react";
import UserItem from "./UserItem";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
 const [myResume, setMyResume] = useState(auth.resume);
 const [setting, setSetting] = useState("");
 useEffect(()=>{
  const BlockUser = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/settings/` + auth.setting._id,
        'GET',
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setSetting(responseData.setting);
    } catch (err) {
      console.log(err);
    }
  }
  BlockUser();
},[auth.setting._id,auth.token,sendRequest])

  return (
    <>
      {!isLoading ? (
        <UserItem
          resume={ props.userResume.user ? props.userResume : myResume }
          approvedCertCount={props.approvedCertCount}
          userInter={props.userInterviews}
          userSett = {props.userSetting}
          otherUser = {props.otherUser}
          setMyResume = {setMyResume}
          setting = {setting}
        />
      ) : (
        <LoadingSpinner open={isLoading} />
      )}
    </>
  );
};

export default Users;
