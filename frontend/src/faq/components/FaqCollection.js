import React, { useState, useEffect } from "react";
import FaqList from "./FaqList";
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const FaqCollection = (props) => {

  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  
  return (
  <React.Fragment>
    <LoadingSpinner open={isLoading} />
    <FaqList items={props.faqs} />
  </React.Fragment>
  )
};

export default FaqCollection;
