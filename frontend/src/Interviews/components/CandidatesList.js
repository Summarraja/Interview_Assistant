import React, { useState, useEffect, useContext } from "react";
import InterviewCandidates from "./InterviewCandidates";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const CandidateList = (props) => {

  const auth = useContext(AuthContext);
  const { isLoading,  sendRequest } = useHttpClient();

  const [candidateResume, setCandidateResume] = useState([]);
  



  useEffect(() => {
    setCandidateResume([]);
    const fetchCandidateResume = async (candID) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/resumes/user/${candID}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );

        setCandidateResume((oldArray) => [...oldArray, responseData.resume]);
      } catch (err) {
        console.log(err);
      }
    };
    props.interCandidates.map((candidate) =>
      fetchCandidateResume(candidate.id)
    );
  }, [props.interCandidates,auth.token,sendRequest]);

  return (
   
    !isLoading &&
    
    candidateResume && (
    
      <InterviewCandidates
        candidateResume={candidateResume}
        interCandidates={props.interCandidates}
        interReceivedRequests = {props.interReceivedRequests}
        interId={props.interId}
        open={props.open}
        setOpen={props.setOpen}
        getInterviewRequestsData = {props.getInterviewRequestsData}
      />
   
    )
   
  );
};
export default CandidateList;
