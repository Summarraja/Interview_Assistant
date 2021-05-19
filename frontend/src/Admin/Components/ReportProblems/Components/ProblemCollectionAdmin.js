import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import ProblemListAdmin from "./ProblemListAdmin";

const ProblemCollectionAdmin = () => {
  const [problems, setproblems] = useState();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/problems/unanswer'
        );
        setproblems(responseData.unanswerdproblems);
        {console.log("responsedata" +" "+ responseData.unanswerdproblems.length)}
      } catch (err) {
        console.log(err)
      }
    }

    if (!problems)
      getData();

  }, [problems])

console.log("hello")

  return (
  <React.Fragment>
    <LoadingSpinner open={isLoading} />
    {problems && (<ProblemListAdmin items={problems}  setproblems ={setproblems}
    />)}
  </React.Fragment>
  )
};

export default ProblemCollectionAdmin;
