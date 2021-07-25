import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import ProblemListAdmin from "./ProblemListAdmin";

const ProblemCollectionAdmin = () => {
  const [problems, setproblems] = useState();
  const { isLoading,  sendRequest } = useHttpClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/problems/unanswer`
        );
        setproblems(responseData.unanswerdproblems);
      } catch (err) {
        console.log(err)
      }
    }

    if (!problems)
      getData();

  }, [problems,sendRequest])



  return (
  <React.Fragment>
    <LoadingSpinner open={isLoading} />
    {problems && (<ProblemListAdmin items={problems}  setproblems ={setproblems}
    />)}
  </React.Fragment>
  )
};

export default ProblemCollectionAdmin;
