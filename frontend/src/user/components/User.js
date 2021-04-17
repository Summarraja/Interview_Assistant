import React, {useContext, useEffect, useState}from "react";
import UserItem from "./UserItem";
import { AuthContext } from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
  const auth = useContext(AuthContext);
  const {isLoading, error, status, sendRequest, clearError} = useHttpClient();
  const [interviews, setInterviews] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/interviews/user/" + auth.userId,
          'GET',
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setInterviews(responseData.interviews);
      } catch (err) {
        console.log(err);
      }
    };
    fetchInterviews();
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/certificates/user/" + auth.userId,
          'GET',
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setCertificates(responseData.certificate);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCertificates();
  }, []);


  return (
  <> 
  

    {!isLoading ? 
    <UserItem resume={auth.resume} userCertificate = {certificates} setting={auth.setting} userInterviews = {interviews} /> :   
     <LoadingSpinner open={isLoading} />
    }
  </>
  );
};

export default Users;
