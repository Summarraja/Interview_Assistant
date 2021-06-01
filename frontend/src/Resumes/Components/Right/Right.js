import React, { useContext, useState, useEffect } from "react";
import Paper from "./Paper/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { ResumeContext } from "../../Contexts/ResumeContext";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
   marginTop:"3%",
   marginLeft:"2.5%"

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
  const { setContent, content} = useContext(ResumeContext);
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const [success, setSuccess] = useState(false);
  const [responsemessage, setresponsemessage] = useState();

  const clearSuccess = () => {
    setSuccess(false);
  };
  useEffect(() => {
    setSuccess(status == 200);
  }, [status, responsemessage]);
  const classes = useStyles();


  const handleDeleteData = async () => {

    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/resumes/${auth.resume._id}`,
        'PATCH',
        JSON.stringify({
          dob: auth.resume.dob,
          firstname: content.header.firstname,
          lastname: content.header.lastname,
          address: content.header.address,
          email: content.header.email,
          country: content.header.country,
          city: content.header.city,
          phone: content.header.phone,
          professional: { desc1: ["", "", ""], desc2: ["", "", ""] },
          education: {},
          additional: [],
        }),
        {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + auth.token,
        }
      );
      if (responseData.resume ) {
        setresponsemessage("")
        const storedData = JSON.parse(localStorage.getItem("userData"));
        storedData.resume = {...responseData.resume};
        auth.setResume({...responseData.resume});
        localStorage.setItem("userData", JSON.stringify(storedData));
        setContent({
          header: {
            firstname: responseData.resume.firstname,
            lastname: responseData.resume.lastname,
            address: responseData.resume.address,
            email: responseData.resume.email,
            country: responseData.resume.country,
            city: responseData.resume.city,
            phone: responseData.resume.phone,
          },
          professional: { desc1: ["", "", ""], desc2: ["", "", ""] },
          education: {},
          additional: [],
        });
      }
    }
    catch (err) {
    }
  };
  const handleSaveToPDF = (event) => {    
    // event.preventDefault();
    window.print();
  };

  const handleSaveResume = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/resumes/${auth.resume._id}`,
        'PATCH',
        JSON.stringify({
          dob: auth.resume.dob,
          firstname: content.header.firstname,
          lastname: content.header.lastname,
          address: content.header.address,
          email: content.header.email,
          country: content.header.country,
          city: content.header.city,
          phone: content.header.phone,
          professional: content.professional,
          education: content.education,
          additional: content.additional,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + auth.token,
        }
      );
      if (responseData.resume) {
        setresponsemessage(responseData.message)
        const storedData = JSON.parse(localStorage.getItem("userData"));
        storedData.resume = {...responseData.resume};
        auth.setResume({...responseData.resume});
        localStorage.setItem("userData", JSON.stringify(storedData));
        setContent({
          header: {
            firstname: responseData.resume.firstname,
            lastname: responseData.resume.lastname,
            address: responseData.resume.address,
            email: responseData.resume.email,
            country: responseData.resume.country,
            city: responseData.resume.city,
            phone: responseData.resume.phone,
          },
          professional: responseData.resume.professional?responseData.resume.professional:{ desc1: ["", "", ""], desc2: ["", "", ""] },
          education: responseData.resume.education?responseData.resume.education:{},
          additional: responseData.resume.additional?responseData.resume.additional:[],
        });
      }
    }
    catch (err) {
    }

  };

  return (
    <div className="right">
      
      {isLoading && <LoadingSpinner open={isLoading} />}
      <Snackbar
        open={success || !!error}
        autoHideDuration={6000}
        onClose={status == "200" ? clearSuccess : clearError}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={status == "200" ? "success" : "error"}
          onClose={status == "200" ? clearSuccess : clearError}
        >

          {status == "200"&& responsemessage=="Updated resume."  ? "Resume Saved Sucessfully!": status == "200"&& responsemessage==""  ? "Resume Deleted Sucessfully!" : error}
      
        </MuiAlert>
      </Snackbar>
      <div className={classes.root}>
        <Link  onClick={handleSaveToPDF}>
          <Tooltip title="Save to PDF" placement="right">
            <Avatar className={classes.green}>
              <PictureAsPdfIcon />
            </Avatar>
          </Tooltip>
        </Link>
        <Link  onClick={handleDeleteData}>
          <Tooltip title="Delete Resume" placement="right">
            <Avatar className={classes.green}>
              <DeleteIcon />
            </Avatar>
          </Tooltip>
        </Link>
        <Link onClick={handleSaveResume}>
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