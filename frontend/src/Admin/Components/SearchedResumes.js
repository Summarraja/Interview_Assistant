import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../shared/context/auth-context";
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from "@material-ui/core";
import DeleteUser from "./DeleteUser";

const useStyles = makeStyles((theme) => ({
  list: {
    padding: 0,
  },
  responsive: {
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
    },
  },
  listItem: {
    padding: "4px 8px",
  },
  ViewButton: {
    height: "35px",
    margin: "10px 20px",
    [theme.breakpoints.up("sm")]: {
      float: "right",
    },
    [theme.breakpoints.down("sm")]: {
      float:"center"
    },
  },

}));

export default function SearchedResumes(props) {
const auth = useContext(AuthContext);
    const classes = useStyles();

    const [OpenDeleteDialog, setOpenDeleteDialog] = useState(false);

    const OpenDeleteDialogHandler = () => {
      setOpenDeleteDialog(true);
    };


 
return(
props.userId != auth.userId && (
  <List className={classes.list}>
  <Grid container>
    <Grid item xs={9} className={classes.responsive}>
      <ListItem
        className={classes.listItem}
      //  button
      >
        <ListItemAvatar>
          <Avatar
           src={"http://localhost:5000/" + props.file}
            style={{
              height: "50px",
              width: "50px",
              marginRight: 10,
            }}
          />
        </ListItemAvatar>
        <ListItemText>
          {props.name} 
          </ListItemText>
          </ListItem>
          </Grid>
          <Grid item xs={3} className={classes.responsive}>
          <Button
          button = "true"
          color="primary"
          className={classes.ViewButton}
          startIcon={<DeleteIcon style={{ marginLeft: 6 }} />}
          onClick={() => {
            OpenDeleteDialogHandler();
          }}
          >
           Delete
          </Button>

          {OpenDeleteDialog && (
                        <DeleteUser
                        OpenDeleteDialog={OpenDeleteDialog}
                        setOpenDeleteDialog={setOpenDeleteDialog}
                        userId={props.userId}
                        />
                    )}

     </Grid>
   

  </Grid>
</List>
)
 
);
}
