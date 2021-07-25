import React from "react";
import ProblemList from "./ProblemList";

const ProblemCollection = (props) => {
  return (
  <React.Fragment>
   
    <ProblemList items={props.faqs}  setFaqs ={props.setFaqs}
    />
  </React.Fragment>
  )
};

export default ProblemCollection;
