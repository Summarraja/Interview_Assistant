import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ProblemList from "./ProblemList";



const ProblemCollection = (props) => {
  const [faqs, setFaqs] = useState();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();


  return (
  <React.Fragment>
   
    <ProblemList items={props.faqs}  setFaqs ={props.setFaqs}
    />
  </React.Fragment>
  )
};

export default ProblemCollection;
