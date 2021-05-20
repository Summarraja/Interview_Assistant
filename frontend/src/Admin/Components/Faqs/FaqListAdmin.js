import React from "react";

import FaqListItemsAdmin from "./FaqListItemsAdmin";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const FaqListAdmin = (props) => {
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
            color="primary"
            align="center"
            style={{ padding: "20px 0px" }}
          >
            {"No Faqs has been added by the Admin"}
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
        <FaqListItemsAdmin
          key={faq._id}
          id={faq._id}
          question={faq.question}
          answer={faq.answer}
          setFaqs={props.setFaqs}
        />
      ))}
    </>
  );
};
export default FaqListAdmin;
