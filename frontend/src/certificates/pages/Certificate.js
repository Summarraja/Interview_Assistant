import React, { useContext, useState , useEffect} from "react";
// import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import bgInterview5 from "../../shared/components/UIElements/Images/bgInterview5.jpg";
import Box from "@material-ui/core/Box";
import { Paper, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AddCertificate from "../components/AddCertificate";
import CertificateList from "../components/CeritificateList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  hero: {
    width: "100%",
    height: 400,
    marginTop: 0,
    backgroundImage: `linear-gradient(
        to bottom,
        rgba(0, 27.8, 46.7, 0.7),
        rgba(78, 120, 160, 0.7)
      ), url(${bgInterview5})`,
         // background:
    //   "linear-gradient( rgba(0, 27.8, 46.7, 0.7), rgba(78, 120, 160, 0.5))",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      height: 300,
      fontSize: "3em",
    },
  },
  paper: {
    margin: "30px auto",
    padding: "20px 50px",
    backgroundColor: "#d3d3d3",
  },
  button: {
    float: "right",
    marginBottom: 15,
  },
}));


const Certificate = () => {
 const [loadedCertificates, setLoadedCertificates ] = useState([]);
 
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  //for getting certificates from the dababase
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/certificates/user/" + auth.userId,
          'GET',
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedCertificates(responseData.certificate);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCertificates();
    
  }, []);

  return (
 
    <div className={classes.root}>
    <Box className={classes.hero}>
      <Box>Certificates</Box>
    </Box>
    <Container maxWidth="lg" component="main">
      <Paper elevation={5} className={classes.paper}>
        <Button
          variant="contained"
          color="primary"
          onClick={
            handleOpenDialog
          }
          className={classes.button}
          startIcon={<AddIcon />}
        >
         Add Cerificates
        </Button>

        {open && (
              <AddCertificate
                open={open}
                handleCloseDialog={handleCloseDialog}
                setOpen={setOpen}
              />
            )}
              {
              (!isLoading)? (<CertificateList items={loadedCertificates}  />) :
                <LoadingSpinner open={true} />
            }

          
          </Paper>
        </Container>
      </div>
   
  );
};

export default Certificate;
