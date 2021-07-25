import React, { useState, useEffect } from "react";
import FaqListAdmin from "./FaqListAdmin";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";



const FaqCollectionAdmin = () => {
  const [faqs, setFaqs] = useState();
  const { isLoading, sendRequest } = useHttpClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/faqs/`
        );
        setFaqs(responseData.faqs);
      } catch (err) {
        console.log(err)
      }
    }

    if (!faqs)
      getData();

  }, [faqs,sendRequest])

  return (
  <React.Fragment>
    <LoadingSpinner open={isLoading} />
    {faqs && (<FaqListAdmin items={faqs}   setFaqs ={setFaqs}
    />)}
  </React.Fragment>
  )
};

export default FaqCollectionAdmin;
