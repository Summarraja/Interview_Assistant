import React, { useContext } from "react";
import Paper from "./Paper/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { green, pink } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "@material-ui/core";
import { ResumeContext } from "../../Contexts/ResumeContext";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    margin: "35px",

  },
  pink: {
    color: "#fffff",
    backgroundColor: "#004777",
    margin: 10,
  },
  green: {
    color: "#fffff",
    backgroundColor: "#004777",
    margin: 10,
  },
}));

function Right() {
  const { setContent, content } = useContext(ResumeContext);
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const classes = useStyles();
  const handleDeleteDate = (event) => {
    event.preventDefault();
    localStorage.clear();
    setContent({
      header: {},
      professional: { desc1: ["", "", ""], desc2: ["", "", ""] },
      education: {},
      additional: [],
    });
  };
  const handleSaveToPDF = (event) => {
    // event.preventDefault();
    window.print();
  };

  const handleSaveResume = async () => {
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/resumes/' + auth.resume.id,
        'PACTH',
        JSON.stringify({
          firstname: content.header.firstName,
          lastname: content.header.lastName,
          fullname: content.header.firstName + " " + content.header.firstName,
          dob: auth.resume.dob,
          gender: auth.resume.gender,
          maxEducation: auth.resume.maxEducation,
          experience: auth.resume.experience,
          field: auth.resume.field,
          address: content.header.address,
          email: content.header.email,
          country: content.header.country,
          city: content.header.city,
          phone: content.header.phone,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + auth.token,

        }
      );
      console.log(responseData)
    }
    catch (err) {
    }

  };

  return (
    <div className="right">
      <div className={classes.root}>
        <Link href="#" onClick={handleDeleteDate}>
          <Tooltip title="Delete All Data" placement="right">
            <Avatar className={classes.pink}>
              <ClearIcon />
            </Avatar>
          </Tooltip>
        </Link>
        <Link href="#" onClick={handleSaveToPDF}>
          <Tooltip title="Save to PDF" placement="right">
            <Avatar className={classes.green}>
              <PictureAsPdfIcon />
            </Avatar>
          </Tooltip>
        </Link>
        <Link href="#" >
          <Tooltip title="Delete Resume" placement="right">
            <Avatar className={classes.green}>
              <DeleteIcon />
            </Avatar>
          </Tooltip>
        </Link>
        <Link href="#" onClick={handleSaveResume}>
          <Tooltip title="Save Resume" placement="right">
            <Avatar className={classes.green}>
              <SaveIcon />
            </Avatar>
          </Tooltip>
        </Link>
      </div>
      <Paper />
    </div>
  );
}

export default Right;
