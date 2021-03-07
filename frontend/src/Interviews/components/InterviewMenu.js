import React, { useState } from "react";
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

const InterviewMenu = (props) => {
 
  //  const CloseDeleteDialogHandler = () =>{
  //   setOpenDeleteDialog(false)
  // }

  //   const [OpenCancelDialog, setOpenCancelDialog] = useState(false);
  //   const OpenCancelDialogHandler = () =>{
  //     setOpenCancelDialog(true)
  //   }
  const [OpenCancelDialog, setOpenCancelDialog] = useState(false);

  const OpenCancelDialogHandler = () => {
    setOpenCancelDialog(true);
  };
  const CloseCancelDialogHandler = () => {
    setOpenCancelDialog(false);
  };
   
  // const [OpenCancelDialog, setOpenCancelDialog] = useState(false);

  // const OpenCancelDialogHandler = () => {
  //   setOpenCancelDialog(true);
  // };

    const [OpenDeleteDialog, setOpenDeleteDialog] = useState(false);
   const OpenDeleteDialogHandler = () =>{
     setOpenDeleteDialog(true)
   }

  return (
    <>
      {" "}
      {props.status === "PENDING" ? (
        <>
          <MenuItem
            onClick={props.closeInterviewMenu}
            component={Link}
            to="/signUp"
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
              />
             
            )}
          <Divider variant="middle" />
          <MenuItem
            onClick={props.closeInterviewMenu}
            component={CandidateList}
          />
          <Divider variant="middle" />
          <MenuItem
            onClick={props.closeInterviewMenu}
            component={Link}
            to="/Faq"
            style={{ height: 40 }}
          >
            <IconButton color="primary">
              <PersonAddIcon />
            </IconButton>
            <Typography variant="subtitle1">Candidate Requests</Typography>
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={OpenDeleteDialogHandler} style={{ height: 40 }}>
            <IconButton color="primary">
              <DeleteIcon />
            </IconButton>

            <Typography variant="subtitle1">Delete Interview</Typography>
          
          </MenuItem>
          {OpenDeleteDialog && <DeleteInterview    
                OpenDeleteDialog={OpenDeleteDialog}
                setOpenDeleteDialog={setOpenDeleteDialog}
                />}
          <Divider variant="middle" />
          <MenuItem
            onClick={props.closeInterviewMenu}
            component={Link}
            to="/Faq"
            style={{ height: 40 }}
          >
            <IconButton color="primary">
              <PersonAddIcon />
            </IconButton>
            <Typography variant="subtitle1">Candidate Requests</Typography>
          </MenuItem>
        </>
      )}
    </>
  );
};

export default InterviewMenu;
