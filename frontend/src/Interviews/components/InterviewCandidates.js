import React, { useState } from "react";
import SearchBar from "material-ui-search-bar";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import IconButton from "@material-ui/core/IconButton";

import Typography from "@material-ui/core/Typography";
import { IoIosPeople } from "react-icons/io";
import { MenuItem } from "@material-ui/core";

import CandidatesDialogItems from "./CandidatesDialogItems";


const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  search: {
    margin: theme.spacing(2),
  },
  dialogTitle: {
    variant: "h6",
    color: theme.palette.primary.main,
  },
  
}));


const CustomizedDialogs = (props) => {
    const [open, setOpen] = useState(true);

const handleOpenDialog = () => {
  setOpen(true);
};
const handleCloseDialog = () => {
  setOpen(false);
};
 
  const classes = useStyles();

  return (
    <div>
      <Dialog
        onClose={handleCloseDialog}
        open={open}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          onClose={handleCloseDialog}
          className={classes.dialogTitle}
        >
          Search Candidates
         <SearchBar className = {classes.search}/>
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.demo}>

             {props.items.length === 0 ? "No users Found":
             props.items.map((candidate) => (
              <CandidatesDialogItems
                key={candidate.id}
                id={candidate.id}
                name={candidate.name}
                image={candidate.image}
              />
            ))
            }
         
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomizedDialogs;
