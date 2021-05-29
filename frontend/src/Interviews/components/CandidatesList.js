import React, { useState, useEffect, useContext } from "react";
import InterviewCandidates from "./InterviewCandidates";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const CandidateList = (props) => {

  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const [candidateResume, setCandidateResume] = useState([]);
  



  useEffect(() => {
    setCandidateResume([]);
    const fetchCandidateResume = async (candID) => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/resumes/user/${candID}`,
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
  }, [props.interCandidates]);

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
