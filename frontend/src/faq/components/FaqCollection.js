import React from "react";
import FaqList from "./FaqList";

const FaqCollection = () => {
  const FAQS = [
    {
      id: "q1",
     Question: " Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo lobortis",   
     Answer:" Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo loborti"
    },
    {
        id: "q2",
       Question: " Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo lobortis",   
       Answer:" Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo loborti"
      },

      {
        id: "q3",
       Question: " Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo lobortis",   
       Answer:" Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo loborti"
      },

      {
        id: "q4",
       Question: " Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo lobortis",   
       Answer:" Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo loborti"
      },

      {
        id: "q5",
       Question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit lleo lobortis",   
       Answer:"Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo loborti"
      },

      {
        id: "q6",
       Question: " Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo lobortis",   
       Answer:" Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse malesuada lacus ex, sit amet blandit leo loborti"
      },

  ];
  return <FaqList items={FAQS} />;
};

export default FaqCollection;
