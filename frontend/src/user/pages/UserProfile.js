import React, {useContext, useEffect, useState} from "react";
import Container from "@material-ui/core/Container";
import User from "../components/User";
import { CssBaseline } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { AuthContext } from '../../shared/context/auth-context';
import {useHttpClient} from '../../shared/hooks/http-hook';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

export default function UserProfile() {
  const auth = useContext(AuthContext);
  const {isLoading, sendRequest} = useHttpClient();
  const [interviews, setInterviews] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [setting, setSetting] = useState("");
  const [resume, setResume] = useState("");
  const [approvedCertCount, setApprovedCertCount] = useState(0);
  const { uid } = useParams();



  useEffect(() => {
    const fetchInterviews = async (usID) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/interviews/user/` + usID,
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
    if(uid)
       fetchInterviews(uid);
    else
       fetchInterviews(auth.userId)

  }, [uid,auth.token,auth.userId,sendRequest]);

  useEffect(() => {
    const fetchCertificates = async (usID) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/certificates/user/` + usID,
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
    if(uid)
       fetchCertificates(uid);
   else
      fetchCertificates(auth.userId)
  }, [uid,auth.token,auth.userId,sendRequest]);

  useEffect(() => {
    const fetchSetting = async (usID) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/settings/user/` + usID,
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
    };
    if(uid)
       fetchSetting(uid);

  }, [uid,auth.token,sendRequest]);

  useEffect(() => {
    const fetchResume = async (usID) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/resumes/user/` + usID,
          'GET',
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setResume(responseData.resume);
      } catch (err) {
        console.log(err);
      }
    };
    if(uid)
       fetchResume(uid);
    else
       setResume("")

  }, [uid,auth.token,sendRequest]);


 useEffect (()=>{
  const countApprovedCert = () =>{
    if(uid){
     certificates.map((cert)=>{
      return  cert.isApproved === true && setApprovedCertCount(approvedCertCount+1);
    })
  }
  else{
   return setApprovedCertCount(certificates.length)
    
  }}
    if (certificates){
       countApprovedCert();
    
    }
 }, [uid, certificates,approvedCertCount]) 
 


  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <LoadingSpinner open={isLoading}/>
      {!isLoading && 
       <User approvedCertCount = {approvedCertCount} otherUser = {(uid===auth.userId)?null:uid} userInterviews = {interviews} userSetting = {setting} userResume = {resume}/>
      
      }
         </Container>
  );
}
