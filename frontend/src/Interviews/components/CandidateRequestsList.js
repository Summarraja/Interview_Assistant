import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import CandidateRequests from "./CandidateRequests";

const CandidateRequestsList = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();

  const [receivedCandResume, setReceivedCandResume] = useState([]);

  useEffect(() => {
    setReceivedCandResume([]);
    const fetchReceiveCandResume = async (candID) => {
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

        setReceivedCandResume((oldArray) => [...oldArray, responseData.resume]);
      } catch (err) {
        console.log(err);
      }
    };
    props.interReceivedRequests.map((candidate) =>
      fetchReceiveCandResume(candidate.id)
    );
  }, [props.interReceivedRequests,auth.token,sendRequest]);

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
