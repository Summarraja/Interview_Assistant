import React from "react";

import FaqListItems from "./FaqListItems";
import AppBar from "@material-ui/core/AppBar";
import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";

const FaqList = (props) => {
  const heading = {
    paddingTop: "16px",
    fontSize: "1.2rem",
  };

  if (props.items.length === 0) {
    return (
      <>
        <AppBar position="static">
          <Typography style={heading}>FREQUENTLY ASKED QUESTIONS</Typography>
        </AppBar>
        <Container maxWidth="md" component="main">
          <Typography
            variant="h4"
            color = "primary"
            align="center"
            style={{ padding: "20px 0px" }}
          >
            {"No faqs are found"}
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Typography style={heading}>FREQUENTLY ASKED QUESTIONS</Typography>
      </AppBar>
      {props.items.map((faq) => (
        <FaqListItems
          key={faq._id}
          id={faq._id}
          question={faq.question}
          answer={faq.answer}
        />
      ))}
    </>
  );
};

export default FaqList;
