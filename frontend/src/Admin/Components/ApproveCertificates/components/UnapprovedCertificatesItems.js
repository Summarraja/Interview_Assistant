import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Link} from "react-router-dom";

import { Menu, MenuItem } from "@material-ui/core";
import { IoMdEye } from "react-icons/io";
import { FiShieldOff } from "react-icons/fi";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";
import OutsideClickHandler from "react-outside-click-handler";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IconButton from "@material-ui/core/IconButton";
import LoadingSpinner from "../../../../shared/components/UIElements/LoadingSpinner";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { grey } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import {  GiStamper } from "react-icons/gi";

import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { AuthContext } from "../../../../shared/context/auth-context";


const useStyles = makeStyles((theme) => ({
    root: {
        padding: "12px 0px"
    },
  card: {
    width: "100%",
    display: "flex",
    marginTop: "15px",
    padding: "12px 17px",
    // background:
    //   "linear-gradient( rgba(0, 27.8, 46.7, 0.7), rgba(78, 120, 160, 0.5))",
  },
  header: {
    flexGrow: 1,
  },
  ViewButton: {
    height: "35px",
    marginTop: "12px ",
    marginRight: "10px",
    [theme.breakpoints.up("sm")]: {
      float: "right",
    },
    [theme.breakpoints.down("sm")]: {
      float: "right",
      marginRight: "0px",
    },
    [theme.breakpoints.down("xs")]: {
      float: "left",
    },
  },
  statusStyle: {
    background: "#4E78A0",
    color: "#fff",
    textAlign: "center",
    height: "35px",
    marginTop: "12px ",
    paddingTop: "5px",
    alignContent: "center",
    width: "140px",
    borderRadius: 4,
    float: "right",
    [theme.breakpoints.up("sm")]: {
      float: "right",
    },
    [theme.breakpoints.down("xs")]: {
      float: "left",
      marginRight: "10px",
    },
  },
  statusIconStyle: {
    marginRight: "7px",
    transform: "translate(1px, 3px)",
    fontSize: "1rem",
  },
}));

const UnapprovedCertificatesItems = (props) => {

  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [loadedField, setLoadedField] = useState();
  const [responseStatus, setResponseStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const MoreIconStyle = {
    marginTop: "5px",
  };
  const classes = useStyles();

  const clearSuccess = () => {
    setSuccess(false);
  };
  useEffect(() => {
    setSuccess(status == 200);
  }, [status]);

  const ApproveCertificateHandler = () =>{
    const ApproveCertificate = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/certificates/accept/${props.id}`,
            "PATCH",
             null,
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
         
          setResponseStatus(responseData.responseMsg);
          props.fetchUnapprovedCertificates();
        } catch (err) {
          console.log(err);
        }
      };
      ApproveCertificate();
  }

  const RejectCertificateHandler = () =>{
    const RejectCertificate = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/certificates/reject/${props.id}`,
            "PATCH",
             null,
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          setResponseStatus(responseData.responseMsg);
          props.fetchUnapprovedCertificates();
          
        } catch (err) {
          console.log(err);
        }
      };
      RejectCertificate();
  }

  //for getting field of loaded Certificate from the dababase
  //   useEffect(() => {
  //     const fetchField = async () => {
  //       try {
  //         const responseData = await sendRequest(
  //           `http://localhost:5000/api/fields/${props.field}`,
  //           "GET",
  //           null,
  //           {
  //             "Content-Type": "application/json",
  //             Authorization: "Bearer " + auth.token,
  //           }
  //         );
  //         setLoadedField(responseData.field);
  //       } catch (err) {}
  //     };
  //     if (!loadedField)
  //     fetchField();
  //   }, [loadedField]);

  const [CertificateMobAnchorEl, setCertificateMobAnchorEl] = useState(null);
  const isCertificateMenuOpen = Boolean(CertificateMobAnchorEl);

  const openCertificateMenu = (event) => {
    setCertificateMobAnchorEl(event.currentTarget);
  };
  const closeCertificateMenu = () => {
    setCertificateMobAnchorEl(null);
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const CertificateMobileMenu = (
    <Menu
      anchorEl={CertificateMobAnchorEl}
      keepMounted
      open={isCertificateMenuOpen}
      getContentAnchorEl={null}
       anchorOrigin={{
        vertical: 30,
        horizontal: 100,
      }}
    >
 
        <MenuItem
          style={{ height: 40 }}
           component={Link}
          to={`/certificates/edit/${props.id}`}
        >
          <IconButton color="primary" className = {classes.root}>
            <IoMdEye />
          </IconButton>
          <Typography variant="subtitle1">View Details</Typography>
        </MenuItem>
      
    </Menu>
  );

  return (
      <>
      <LoadingSpinner open={isLoading}/>
    {
        <Snackbar
          open={success || !!error}
          autoHideDuration={6000}
          onClose={status == "200" ? clearSuccess : clearError}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={status == "200" ? "success" : "error"}
            onClose={status == "200 " ? clearSuccess : clearError}
          >
            {status == "200" && responseStatus == "approved"
              ? "User's Certificate has been approved successfully!"
              : responseStatus == "rejected"
              ? "User's Certificate has been rejected successfully!"
              : error}
          </MuiAlert>
        </Snackbar>
      }
    <Card className={classes.card}>
      <Grid container spacing={2}>
        <Grid item sm={6} lg={7} style={{ flexGrow: 1 }}>
          <div className={classes.header}>
            <Typography variant="h5" align="justify">
              {props.title}
            </Typography>
            <Typography variant="subtitle1" style={{ color: grey[900] }}>
              {loadedField && loadedField.title}
            </Typography>
          </div>
        </Grid>

        <Grid item sm={6} lg={5} >
        {status == "200" ? (
                <Typography variant="subtitle2" className={classes.statusStyle}>
                  {responseStatus == "approved" ? (
                    <GiStamper className={classes.statusIconStyle} />
                  ) : (
                    <FiShieldOff className={classes.statusIconStyle} />
                  )}

                  {responseStatus == "approved" ? "APPROVED" : "REJECTED"}
                </Typography>
                
                ) : (
                    <>
                <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.ViewButton}
            startIcon={<FiShieldOff style={{ marginLeft: 6 }} />}
           onClick={RejectCertificateHandler}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.ViewButton}
            startIcon={<GiStamper style={{ marginLeft: 6 }} />}
            onClick = {ApproveCertificateHandler}
          >
            Approve
          </Button>
          </>
                )}
        </Grid>
      </Grid>

      <OutsideClickHandler onOutsideClick={closeCertificateMenu}>
        <IconButton onClick={openCertificateMenu} className = {classes.root}>
          <MoreVertIcon style={MoreIconStyle} />
        </IconButton>
      </OutsideClickHandler>
      {CertificateMobileMenu}
    </Card>
    </>
  );
};

export default UnapprovedCertificatesItems;
