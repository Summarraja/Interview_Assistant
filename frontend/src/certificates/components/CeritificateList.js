import React, {useContext} from "react";
import CertificateItems from "./CertificateItems";
import Container from "@material-ui/core/Container";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Typography from "@material-ui/core/Typography";
import { AuthContext } from "../../shared/context/auth-context";

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
const CertificateList = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  if (props.items.length === 0) {
    return (
      <Container maxWidth="md" component="main">
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h4" color="primary" align="center">
           {auth.setting.role == "Candidate" ? "No certificates has been added by this User": " No certificates found. Maybe create one?"} 
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (props.approvedCertCount == 0 && props.uid != auth.userId ){
    return (
      <Container maxWidth="md" component="main">
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h4" color="primary" align="center">
            No certificate has been added by the user yet
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <>
    <AppBar position="static" >
      <Typography className = {classes.heading}>ADDED CERTIFICATES</Typography>
     </AppBar>
     { props.items.map((certificate) => (
         ((props.hasDeleteAccess) || (!props.hasDeleteAccess && certificate.isApproved == true ))&& (
        <CertificateItems
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
          hasDeleteAccess={props.hasDeleteAccess}
          approvedCertCount={props.approvedCertCount}
          setLoadedCertificates={props.setLoadedCertificates}
         
        />
       )
      ))}
    </>
  );
};

export default CertificateList;
