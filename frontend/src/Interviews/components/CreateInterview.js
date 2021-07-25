import React, { Fragment, useState , useContext} from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import DvrIcon from "@material-ui/icons/Dvr";
import Dialog from "@material-ui/core/Dialog";
import InterviewForm from "./InterviewForm";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
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

const CreateInterview = (props) => {
  var curr = new Date();
  curr.setDate(curr.getDate() + 3);
  var date = curr.toISOString().substr(0, 10);
  const [field, setField] = useState("Computer Science");
  const [doi, setDoi] = useState(date);
  const [timeOfInter, setTimeOfInter] = useState("12:00");


  const avatarStyle = {
    backgroundColor: "primary",
  };
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const {  sendRequest } = useHttpClient();

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

  
 

  return (
    <Fragment>
      <Dialog open={props.open} fullWidth maxWidth="sm">
        <DialogTitle disableTypography>
          <Typography variant="h4" align="center">
            Schedule Interview
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
            <InterviewForm
              field={field}
              setField={setField}
              doi={doi}
              setDoi={setDoi}
              timeOfInter={timeOfInter}
              setTimeOfInter={setTimeOfInter}
              setOpen={props.setOpen}
              getData = {getData}
            
            />
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

export default CreateInterview;
