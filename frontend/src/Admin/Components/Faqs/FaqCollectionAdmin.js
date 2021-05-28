import React, { useState, useEffect } from "react";
import FaqListAdmin from "./FaqListAdmin";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";



const FaqCollectionAdmin = () => {
  const [faqs, setFaqs] = useState();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/faqs/'
        );
        setFaqs(responseData.faqs);
      } catch (err) {
        console.log(err)
      }
    }

    if (!faqs)
      getData();

  }, [faqs])

  return (
  <React.Fragment>
    {console.log("faqs are" +faqs)}
    <LoadingSpinner open={isLoading} />
    {faqs && (<FaqListAdmin items={faqs}   setFaqs ={setFaqs}
    />)}
  </React.Fragment>
  )
};

export default FaqCollectionAdmin;
