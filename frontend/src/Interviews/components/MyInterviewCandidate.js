import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IoMdEye } from "react-icons/io";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { grey } from "@material-ui/core/colors";
import { Link , useLocation} from "react-router-dom";
import BlockIcon from "@material-ui/icons/Block";
import { FaRegCheckCircle, FaRegClock } from "react-icons/fa";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "@material-ui/core/Button";
import theme from "../../shared/components/UIElements/AppTheme/theme";
import { MdEventAvailable, MdEventBusy } from "react-icons/md";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    display: "flex",
    padding: "10px 17px",
    marginTop: "15px",
  },
  header: {
    flexGrow: 1,
  },
  ViewButton: {
    height: "35px",
    marginTop: "12px ",
    marginLeft: "10px",
    [theme.breakpoints.up("sm")]: {
      float: "right",
    },
    // [theme.breakpoints.down("sm")]: {
    //   display: "none",
    // },
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
  },
  statusIconStyle: {
    marginRight: "7px",
    transform: "translate(1px, 3px)",
    fontSize: "1rem",
  },
  noRequests: {
    width: "100%",
    padding: "10px 17px",
    color: "#004777",
  },
  statusStyle: {
    background: "#4E78A0",
    color: "#fff",
    textAlign: "center",
    height: "35px",
    marginTop: "12px ",
    marginLeft: "12px ",
    paddingTop: "5px",
    alignContent: "center",
    width: "140px",
    borderRadius: 4,
    float: "right",
  },
  statusIconStyle: {
    marginRight: "7px",
    transform: "translate(1px, 3px)",
    fontSize: "1rem",
  },
}));

const InterviewItems = (props) => {
  const auth = useContext(AuthContext);
  let location = useLocation();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const classes = useStyles();
  const[responseStatus, setResponseStatus] = useState();

  const [success, setSuccess] = useState(false);

  const clearSuccess = () => {
    setSuccess(false);
  };
  useEffect(() => {
    setSuccess(status == 201 || status == 200);
  }, [status]);

  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const today = new Date();

  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const CurrentDate = new Date(date);

  const CancelInterviewRequestHandler = () => {
    const cancelInterviewRequest = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/cancelinterreq/${props.InterID}`,
          "PATCH",
          JSON.stringify({
            uid: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        props.getCandidateRequestsData();
        
      } catch (err) {
        console.log(err);
      }
    };
    cancelInterviewRequest();
  };

  const AcceptReceiveRequestHandler = () => {
    const AcceptReceiveRequest = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/addcandidate/${props.InterID}`,
          "PATCH",
          JSON.stringify({
            uid: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setResponseStatus(responseData.responseDone);
        props.getCandidateRequestsData();
      
      } catch (err) {
        console.log(err);
      }
    };
    AcceptReceiveRequest();
  };

  const RejectReceiveRequestHandler = () => {
    const RejectReceiveRequest = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/rejectcandidate/${props.InterID}`,
          "PATCH",
          JSON.stringify({
            uid: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setResponseStatus(responseData.responseDone);
        props.getCandidateRequestsData();

      } catch (err) {
        console.log(err);
      }
    };
    RejectReceiveRequest();
  };

  return (
    <>
      {isLoading && <LoadingSpinner open={isLoading} />}
      <Snackbar
        open={success || !!error}
        autoHideDuration={6000}
        onClose={status == "201" || status == "200" ? clearSuccess : clearError}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={status == "201" || status == "200" ? "success" : "error"}
          onClose={
            status == "201" || status == "200" ? clearSuccess : clearError
          }
        >
          {error ? error:
          status == "201"
            ? "Request has been cancelled successfully!"
            : status == "200" && responseStatus == "accepted"
            ? "You are added to the scheduled interview successfully!" :
               "You have rejected this Interview request!" }
           
        </MuiAlert>
      </Snackbar>

 
 <Card className={classes.card}>
  <Grid container spacing={5}>
    <Grid item sm={6} lg={7} style={{ flexGrow: 1 }}>
      <div className={classes.header}>
        <Typography variant="h5" align="justify">
          {props.InterTitle}
        </Typography>
        <Typography variant="subtitle1" style={{ color: grey[900] }}>
          {props.InterDate}
        </Typography>
      </div>
    </Grid>
  
    <Grid item sm={6} lg={5}>
      {props.tabValue == "3" && (
        <Typography variant="subtitle2" className={classes.statusStyle}>
          {(props.InterStatus === "PENDING" && (
            <FaRegClock className={classes.statusIconStyle} />
          )) ||
            (props.InterStatus === "TAKEN" && (
              <FaRegCheckCircle className={classes.statusIconStyle} />
            )) ||
            (props.InterStatus === "CANCELLED" && (
              <BlockIcon className={classes.statusIconStyle} />
            ))}
          {props.InterStatus}
        </Typography>
      )}
  
      {props.tabValue == "1" && status != "201" && (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          className={classes.ViewButton}
          onClick={CancelInterviewRequestHandler}
          startIcon={<BlockIcon style={{ marginLeft: 6 }} />}
        >
          Cancel Request
        </Button>
      )}
      {props.tabValue == "2" && (
        <>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            className={classes.ViewButton}
            onClick={RejectReceiveRequestHandler}
            startIcon={
              <MdEventBusy
                style={{ marginLeft: 5, fontSize: "1.3rem" }}
              />
            }
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            className={classes.ViewButton}
            onClick={AcceptReceiveRequestHandler}
            startIcon={
              <MdEventAvailable
                style={{ marginLeft: 5, fontSize: "1.3rem" }}
              />
            }
          >
            Accept
          </Button>
        </>
      )}
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.ViewButton}
        startIcon={<IoMdEye style={{ marginLeft: 6 }} />}
        component={Link}
        to={`/interviews/view/${props.InterID}`}
      >
        View Details
      </Button>
    </Grid>
  </Grid>
  </Card>
  
{/* )} */}

    
    </>
  );
};

export default InterviewItems;
