import React, { useContext, useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";

import { Paper, Toolbar } from "@material-ui/core";
import Container from "@material-ui/core/Container";

import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { AuthContext } from "../../../../shared/context/auth-context";

import UnapprovedCertificatesList from "../components/UnapprovedCertificatesList";
import LoadingSpinner from "../../../../shared/components/UIElements/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 250,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
  },

  paper: {
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1, 1),

      width: "auto",
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(3, 8),
      width: "auto",
    },
  },
  button: {
    float: "right",
    marginBottom: 15,
  },
}));

const ApproveCertificate = () => {
  const [loadedCertificates, setLoadedCertificates] = useState([]);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const classes = useStyles();

  //for getting all unappoved certificates from the dababase
  useEffect(() => {
    const fetchUnapprovedCertificates = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/certificates/",
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedCertificates(responseData.certificates);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUnapprovedCertificates();
  }, []);


  return (
    <div className={classes.root}>
      <Toolbar />

      <Container maxWidth="lg" component="main">
        <Paper elevation={5} className={classes.paper}>
          {!isLoading ? (
            <UnapprovedCertificatesList
              items={loadedCertificates}
              setLoadedCertificates={setLoadedCertificates}
            />
          ) : (
            <LoadingSpinner open={true} />
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ApproveCertificate;
