import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ProblemList from "./ProblemList";



const ProblemCollection = () => {
  const auth = useContext(AuthContext);
  const [faqs, setFaqs] = useState();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/problems/user/'+ auth.userId
        );
        console.log(responseData)
        setFaqs(responseData.problems);
      } catch (err) {
        console.log(err)
      }
    }

    if (!faqs)
      getData();

  }, [faqs])

  return (
  <React.Fragment>
    <LoadingSpinner open={isLoading} />
    {faqs && (<ProblemList items={faqs}  setFaqs ={setFaqs}
    />)}
  </React.Fragment>
  )
};

export default ProblemCollection;
