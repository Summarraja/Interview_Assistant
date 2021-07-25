import React, { useState, useContext } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { MenuItem } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import DeleteCertificate from "./DeleteCertificate";

const CertificateMenu = (props) => {
  const [OpenDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {sendRequest} = useHttpClient();
  const auth = useContext(AuthContext);
  const OpenDeleteDialogHandler = () => {
    setOpenDeleteDialog(true);
  };



    const fetchCertificates = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/certificates/user/` + auth.userId,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        props.setLoadedCertificates(responseData.certificate);
      } catch (err) {
        console.log(err);
      }
    };

 
  return (
    <>
    {props.hasDeleteAccess && (
      <>
        {/* <MenuItem
        onClick={props.closeCertificateMenu}
        component={Link}
        to={`/certificates/edit/${props.certId}`}
        style={{ height: 40 }}
      >
        <IconButton color="primary">
          <TiEdit />
        </IconButton>
        <Typography variant="subtitle1">Edit Details</Typography>
      </MenuItem>

      <Divider variant="middle" /> */}

      <MenuItem onClick={OpenDeleteDialogHandler} style={{ height: 40 }}>
        <IconButton color="primary">
          <DeleteIcon />
        </IconButton>

        <Typography variant="subtitle1">Remove Certificate</Typography>
      </MenuItem>
      </>
    )}
    
      {OpenDeleteDialog && (
        <DeleteCertificate
          OpenDeleteDialog={OpenDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          certId={props.certId}
          fetchCertificates = {fetchCertificates}
        />
      )}
    </>
  );
};

export default CertificateMenu;
