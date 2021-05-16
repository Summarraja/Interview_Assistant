import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import CandidateRequests from "./CandidateRequests";

const CandidateRequestsList = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const [receivedCandResume, setReceivedCandResume] = useState([]);

  useEffect(() => {
    setReceivedCandResume([]);
    const fetchReceiveCandResume = async (candID) => {
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

        setReceivedCandResume((oldArray) => [...oldArray, responseData.resume]);
      } catch (err) {
        console.log(err);
      }
    };
    props.interReceivedRequests.map((candidate) =>
      fetchReceiveCandResume(candidate.id)
    );
  }, [props.interReceivedRequests]);

  return (
    !isLoading &&
    receivedCandResume && (
      <CandidateRequests
        receivedCandResume={receivedCandResume}
        interId={props.interId}
        open={props.open}
        setOpen={props.setOpen}
        getInterviewRequestsData = {props.getInterviewRequestsData}
      />
    )
  );
};
export default CandidateRequestsList;
