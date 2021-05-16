import React, { Fragment, useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import DvrIcon from "@material-ui/icons/Dvr";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CertificateForm from "./CertificateForm";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Typography: {
    fontFamily: theme.typography.fontFamily,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const AddCertificate = (props) => {
  var curr = new Date();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  curr.setDate(curr.getDate() + 3);
  var date = curr.toISOString().substr(0, 10);
  const [field, setField] = useState("Computer Science");

  const paperStyle = {
    width: 400,
    padding: 20,
    margin: "100px auto",
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const classes = useStyles();

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
      props.setLoadedCertificates(responseData.certificate);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <Dialog open={props.open} fullWidth maxWidth="sm">
        <DialogTitle disableTypography>
          <Typography variant="h4" align="center">
            Add Certificate
          </Typography>

          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <DvrIcon style={avatarStyle} />
            </Avatar>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.demo}>
            <CertificateForm field={field}    fetchCertificates={fetchCertificates}  setField={setField} setOpen = {props.setOpen}/>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleCloseDialog} color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default AddCertificate;
