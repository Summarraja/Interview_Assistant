import React, { Fragment , useContext} from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ReportProblemForm from "./ReportProblemForm";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";


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

const CreateProblem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const getData = async () => {
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/problems/user/'+ auth.userId
      );
      props.setFaqs(responseData.problems);
    } catch (err) {
      console.log(err)
    }
  }
  const paperStyle = {
    width: 400,
    padding: 20,
    margin: "100px auto",
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const classes = useStyles();

  return (
    <Fragment>
      <Dialog open={props.open} fullWidth maxWidth="sm">
        <DialogTitle disableTypography>
          <Typography variant="h4" align="center">
           Something went wrong ?
          </Typography>

          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <ReportProblemIcon style={avatarStyle} />
            </Avatar>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.demo}>
            <ReportProblemForm
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

export default CreateProblem;
