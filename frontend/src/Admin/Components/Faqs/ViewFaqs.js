import React, { useState } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import FaqCollectionAdmin from "./FaqCollectionAdmin";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles, fade } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateFaq from "./CreateFaqs";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 250,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
  },

  button: {
    float: "right",
    margin: "10px auto",
    marginRight: "5rem"
  },

  paper: {

    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1, 1),

      width: "auto",
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(5, 8),
      width: "auto",
    },
  },

}));

export default function ViewFaqs() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Toolbar />

      <div className={classes.root}>
        <Container maxWidth="lg" component="main">
        

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleOpenDialog();
            }}
            className={classes.button}
            startIcon={<AddIcon />}
          >
            Create Faqs
          </Button>

          {open && (
            <CreateFaq
              open={open}
              handleCloseDialog={handleCloseDialog}
              setOpen={setOpen}
            />
          )}

          <Paper elevation={10} className={classes.paper}>
            <div className={classes.collapse}>
              <FaqCollectionAdmin />
            </div>
          </Paper>
          {/* </Paper> */}
        </Container>
      </div>
    </>
  );
}
