import React, {useContext} from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Typography from "@material-ui/core/Typography";
import { AuthContext } from "../../../../shared/context/auth-context";
import UnapprovedCertificatesItems from "../components/UnapprovedCertificatesItems";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "30px auto",
    padding: "20px 50px",
  },
  heading:{
    paddingTop: "16px",
    fontSize: "1.2rem"

  }
}));
const UnapprovedCertificatesList = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

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
      props.setLoadedCertificates(responseData.certificates);
    } catch (err) {
      console.log(err);
    }
  };

  if (props.items.length === 0) {
    return (
        <>
    <AppBar position="static" >
      <Typography className = {classes.heading}>APPROVAL FOR CERTIFICATES</Typography>
     </AppBar>
      <Container maxWidth="md" component="main">
          <Typography variant="h4" color="primary" align="center" style={{padding: "20px 0px"}}>
           { "No certificates are pending for approval"} 
          </Typography>
      </Container>
      </>
    );
  }


  return (
    <>
    <AppBar position="static" >
      <Typography className = {classes.heading}>APPROVAL FOR CERTIFICATES</Typography>
     </AppBar>

     { props.items.map((certificate) => (
        <UnapprovedCertificatesItems
          key={certificate.id}
          id={certificate.id}
          title={certificate.title}
          description={certificate.description}
          institute={certificate.institute}
          isApproved={certificate.isApproved}
          file={certificate.file}
          field={certificate.field}
          status={certificate.isApproved ? "APPROVED" : "UNAPPROVED"}
          creatorId={certificate.creator}
          fetchUnapprovedCertificates={fetchUnapprovedCertificates}
         
        />
       
      ))}
    </>
  );
};

export default UnapprovedCertificatesList;
