import React from "react";
import CertificateItems from "./CertificateItems";
import Container from "@material-ui/core/Container";

import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({

  paper: {
    margin: "30px auto",
    padding: "20px 50px",
  },
}));
const CertificateList = (props) => {
  const classes = useStyles();

  if (props.items.length === 0) {
    return (
      <Container maxWidth="md" component="main">
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h4" color="primary" align="center">
            No certificates found. Maybe create one?
          </Typography>
          {/* <Grid item xs={12}>
            <Card className={classes.card}></Card>
          </Grid> */}
        </Paper>
      </Container>
    );
  }

  return (
  
      <>
      {props.items.map(certificate => (
        <CertificateItems
          key={certificate.id}
          id={certificate.id}
          title={certificate.title}
          description={certificate.description}
          institute={certificate.institute}
          isApproved={certificate.isApproved}
          file={certificate.file}
          field={certificate.field}
          creatorId={certificate.creator}
        />
      ))}
</>
  );
};

export default CertificateList;