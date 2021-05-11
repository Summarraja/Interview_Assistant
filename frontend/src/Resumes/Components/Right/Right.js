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

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
      margin: "35px",
 
  },
  pink: {
    color:"#fffff",
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
  const { setContent } = useContext(ResumeContext);
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
        <Link href="#" >
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
