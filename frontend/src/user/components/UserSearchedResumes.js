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
}));

export default function UserSearchedResumes(props) {
const auth = useContext(AuthContext);
    const classes = useStyles();
return(
props.userId != auth.userId && (
  <List className={classes.list}>
  <Grid container>
    <Grid item xs={12} className={classes.responsive}>
      <ListItem
        className={classes.listItem}
        button
        component={Link}
         to={`/profile/${props.userId}`}
      >
        <ListItemAvatar>
          <Avatar
            src={props.image}
            style={{
              height: "50px",
              width: "50px",
              marginRight: 10,
            }}
          />
        </ListItemAvatar>
        <ListItemText> {props.name} </ListItemText>
      </ListItem>
    </Grid>
  </Grid>
</List>
)
 
);
}
