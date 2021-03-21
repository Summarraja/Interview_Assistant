import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { TiEdit } from "react-icons/ti";
import BlockIcon from "@material-ui/icons/Block";
import { MenuItem, Divider } from "@material-ui/core";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { IoIosPeople } from "react-icons/io";
import DeleteCertificate from "./DeleteCertificate";

const CertificateMenu = (props) => {
  const [OpenDeleteDialog, setOpenDeleteDialog] = useState(false);

  const OpenDeleteDialogHandler = () => {
    setOpenDeleteDialog(true);
  };

  return props.status === "APPROVED" ? (
    <>
      <MenuItem
        onClick={props.closeCertificateMenu}
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
      <MenuItem onClick={OpenDeleteDialogHandler} style={{ height: 40 }}>
        <IconButton color="primary">
          <DeleteIcon />
        </IconButton>

        <Typography variant="subtitle1">Remove Certificate</Typography>
      </MenuItem>
      {OpenDeleteDialog && (
        <DeleteCertificate
          OpenDeleteDialog={OpenDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
        />
      )}
    </>
  ) : (
    <>
      <MenuItem onClick={OpenDeleteDialogHandler} style={{ height: 40 }}>
        <IconButton color="primary">
          <DeleteIcon />
        </IconButton>

        <Typography variant="subtitle1">Remove Certificate</Typography>
      </MenuItem>
      {OpenDeleteDialog && (
        <DeleteCertificate
          OpenDeleteDialog={OpenDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
        />
      )}
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
  );
};

export default CertificateMenu;
