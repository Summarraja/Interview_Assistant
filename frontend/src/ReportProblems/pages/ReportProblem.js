import React, { useState , useEffect, useContext} from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateProblem from "../Components/CreateProblem";
import ProblemCollection from "../Components/ProblemCollection";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 80,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
  },

  button: {
    float: "right",
    margin: "10px auto",
    marginRight: "6rem"
  },

  paper: {
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1, 1),

      width: "auto",
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(3, 10),
      width: "auto",
    },
  },
  collapse: {
    width: "100%",
  },
}));

export default function ReportProblem() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const auth = useContext(AuthContext);
  const [faqs, setFaqs] = useState();
  const { isLoading,  sendRequest } = useHttpClient();

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/problems/user/`+ auth.userId
        );
        if(responseData)
        setFaqs(responseData.problems);
      } catch (err) {
        console.log(err)
      }
    }

    if (!faqs)
      getData();

  }, [faqs,auth.userId,sendRequest])

  return (
    <>
     <LoadingSpinner open={isLoading} />
      <Toolbar />
      <div className={classes.root}>
        <div style={{ marginBottom: "80px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleOpenDialog();
            }}
            className={classes.button}
            startIcon={<AddIcon />}
          >
            Report Problem
          </Button>

          {open && (
            <CreateProblem
              open={open}
              handleCloseDialog={handleCloseDialog}
              setOpen={setOpen}
              faqs = {faqs}
              setFaqs = {setFaqs}
            />
          )}
        </div>
        <div>
          <Paper elevation={10} className={classes.paper}>
            <div className={classes.collapse}>
             {faqs && <ProblemCollection 

               faqs = {faqs}
              setFaqs = {setFaqs}
              />
             }
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
}
