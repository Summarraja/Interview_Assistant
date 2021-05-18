import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ProblemList from "./ProblemList";

const ProblemCollection = () => {
  const [faqs, setFaqs] = useState();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/problems/'
        );
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
