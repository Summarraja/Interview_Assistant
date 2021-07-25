import React, { useState, useContext } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { TiEdit } from "react-icons/ti";
import BlockIcon from "@material-ui/icons/Block";
import { MenuItem, Divider } from "@material-ui/core";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CandidateList from "./CandidatesList";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DeleteInterview from "./DeleteInterview";
import CancelInterview from "./CancelInterview";
import { IoIosPeople } from "react-icons/io";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import CandidateRequestsList from "./CandidateRequestsList";



const InterviewMenu = (props) => {
  const [OpenCancelDialog, setOpenCancelDialog] = useState(false);
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(true);





  const OpenCancelDialogHandler = () => {
    setOpenCancelDialog(true);
  };
  const CloseCancelDialogHandler = () => {
    setOpenCancelDialog(false);
  };

  const [OpenDeleteDialog, setOpenDeleteDialog] = useState(false);
  const OpenDeleteDialogHandler = () => {
    setOpenDeleteDialog(true);
  };


  const [callComp, setCallComp] = useState(false);
  const [callCandidateReq, setCallCandidateReq ] = useState(false);

  const CallCompHandler = () => {
    setCallComp(true);
    setCallCandidateReq(false);
    setOpen(true);
  };

  const callCandidateReqHandler = () => {
    setCallCandidateReq(true);
    setCallComp(false);
    setOpen(true);
  };


  const getData = async (usID) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/interviews/user/` + usID,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.setInterviews(responseData.interviews);
    } catch (err) {
      console.log(err);
    }
  };

  const getInterviewRequestsData = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/interviews/interviewreq/${props.intId}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.setInterSentRequests(responseData.sentRequests);
      
      props.setInterReceivedRequests(responseData.receivedRequests);

      props.setInterCandidates(responseData.candidates);
      

    } catch (err) {
      console.log(err);
    }
  };

   
 
  return (
    <>
    {/* <Snackbar
            open={success  || !!error}
            autoHideDuration={6000}
            onClose={ status == 200? clearSuccess : clearError}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              severity={status == 200? "success" : "error"}
              onClose={ status == 200 ? clearSuccess : clearError}
            >
              {status == 200 ? "Interview Cancelled Successfully!" : error}
            </MuiAlert>
          </Snackbar> */}
      {" "}
      {props.status === "PENDING" ? (
        <>
          <MenuItem
            onClick={props.closeInterviewMenu}
            component={Link}
            to={`/interviews/view/${props.intId}`}
            style={{ height: 40 }}
          >
            <IconButton color="primary">
              <TiEdit />
            </IconButton>
            <Typography variant="subtitle1">Edit Details</Typography>
          </MenuItem>
          <Divider variant="middle" />
          <MenuItem onClick={OpenCancelDialogHandler} style={{ height: 40 }}>
            <IconButton color="primary">
              <BlockIcon />
            </IconButton>
            <Typography variant="subtitle1">Cancel Interview</Typography>
          </MenuItem>
          {OpenCancelDialog && (
            <CancelInterview
              OpenCancelDialog={OpenCancelDialog}
              CloseCancelDialogHandler={CloseCancelDialogHandler}
              setOpenCancelDialog={setOpenCancelDialog}
              selectedInterviewId={props.intId}
              getData = {getData}
            />
          )}
           
          <Divider variant="middle" />
          <MenuItem onClick={CallCompHandler} style={{ height: 40 }}>
            <IconButton color="primary">
              <IoIosPeople />
            </IconButton>
            <Typography variant="subtitle1">Candidates</Typography>
          </MenuItem>
          {callComp &&(
            <CandidateList
              open={open}
              setOpen={setOpen}
              interId={props.intId}
              interSentRequests={props.interSentRequests}
              interReceivedRequests = {props.interReceivedRequests}
              interCandidates={props.interCandidates}
              getInterviewRequestsData = {getInterviewRequestsData}
           
            />
          )}

          <Divider variant="middle" />

          <MenuItem
            onClick={callCandidateReqHandler} 
            style={{ height: 40 }}
          >
            <IconButton color="primary">
              <PersonAddIcon />
            </IconButton>
            <Typography variant="subtitle1">Candidate Requests</Typography>
          </MenuItem>
          { callCandidateReq && (
            <CandidateRequestsList
              open={open}
              setOpen={setOpen}
              interId={props.intId}
              interSentRequests={props.interSentRequests}
              interReceivedRequests = {props.interReceivedRequests}
              getInterviewRequestsData = {getInterviewRequestsData}
    
            />
          )}
        </>
      ) : (
        <>
          <MenuItem onClick={OpenDeleteDialogHandler} style={{ height: 40 }}>
            <IconButton color="primary">
              <DeleteIcon />
            </IconButton>

            <Typography variant="subtitle1">Delete Interview</Typography>
          </MenuItem>
          {OpenDeleteDialog && (
            <DeleteInterview
              OpenDeleteDialog={OpenDeleteDialog}
              setOpenDeleteDialog={setOpenDeleteDialog}
              selectedInterviewId={props.intId}
              getData = {getData}
              // onDelete = {props.onDelete}
            />
          )}
          
        </>
      )}
    </>
  );
};

export default InterviewMenu;
