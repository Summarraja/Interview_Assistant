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
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { FaUserEdit } from "react-icons/fa";
import EditProfileForm from "./EditProfileForm";
import * as yup from "yup";

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

const EditProfile = (props) => {
    const paperStyle = {
        width: 400,
        padding: 20,
        margin: "100px auto",
      };
      const avatarStyle = {
        backgroundColor: "primary",
      };
      const classes = useStyles();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const initialValues = {
    firstName: auth.resume.firstname,
    lastName: auth.resume.lastname,
    dob: auth.resume.dob,
    contact: auth.resume.phone,
    email: auth.resume.email,
    city: auth.resume.city,
    country: auth.resume.country,
    address: auth.resume.address,
  };

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .required("This field is required")
      .matches(/^[A-Za-z ]*$/, "Please enter valid name (Alphabets Only)")
      .min(3, "First Name must be atleast 3 characters"),
  
    lastName: yup
      .string()
      .required("This field is required")
      .matches(/^[A-Za-z ]*$/, "Please enter valid name (Alphabets Only)")
      .min(3, "Last Name must be atleast 3 characters"),
    email: yup.string()
      .required("This field is required")
      .email("Please enter valid username"),

    address: yup
      .string()
      .required("This field is required"),

    city: yup.string().required("This field is required"), 

    contact: yup
      .string()
      .required("This field is required")
      .matches(
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
        "Please enter valid Contact number"
      )
      .length(11),
  });


 



  return (
    <Fragment>
      <Dialog open={props.openEdit} fullWidth maxWidth="sm">
        <DialogTitle disableTypography>
          <Typography variant="h4" align="center">
           Edit Profile
          </Typography>

          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <FaUserEdit style={avatarStyle} />
            </Avatar>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.demo}>
            <EditProfileForm 
              initialValues={initialValues}
              validationSchema={validationSchema}
              setMyResume = {props.setMyResume}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.CloseEditDialogComp} color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default EditProfile;
