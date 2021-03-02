import React from "react";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import ListItemText from "@material-ui/core/ListItemText";

import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
 
RemoveButton: {
  fontSize: "0.8rem",
  margin: "15px 0px",
  width: "140px"
},
listItem: {
  padding: "4px 8px",
},
list:{
  padding: 0
 },

}));
const CandidatesDialogItems = (props) =>{
  const classes = useStyles();
return (
    <List className = {classes.list}>
    <Grid container >
      <Grid item sm={8} >
 
          <ListItem
            className={classes.listItem}
            button
            component={Link}
            to="/profile"
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
      <Grid item sm={4} align="center">
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.RemoveButton}
          startIcon={
            <PersonAddDisabledIcon style={{ marginLeft: 6 }} />
          }
        >
          Remove 
        </Button>
      </Grid>
    </Grid>
  </List>
);
};

export default  CandidatesDialogItems;