import React, { useState, useEffect } from "react";
import FaqList from "./FaqList";
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const FaqCollection = () => {
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
    <LoadingSpinner open={isLoading} />
    {faqs && (<FaqList items={faqs} />)}
  </React.Fragment>
  )
};

export default FaqCollection;
