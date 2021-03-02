import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import DvrIcon from "@material-ui/icons/Dvr";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import EmailIcon from "@material-ui/icons/Email";
import Tooltip from "@material-ui/core/Tooltip";
import Navbar from "./Navbar";
import Fade from "@material-ui/core/Fade";
import ListAltIcon from "@material-ui/icons/ListAlt";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import Hidden from "@material-ui/core/Hidden";
import { Divider } from "@material-ui/core";
import { AuthContext } from "../../context/auth-context";
import { Link } from "react-router-dom";
//import white from '@material-ui/core/colors/white';

//import { AuthContext } from "../   context/auth-context";

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
   
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    background: theme.palette.secondary.main,
    margin: theme.spacing(4, 6),
  },

  drawerWidthLgSc: {
    overflowX: "hidden",
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(8) + 1,
    },
    width: drawerWidth,
  },
   Navicon : {
    fontSize: "2rem",
    color: "#fff",
    [theme.breakpoints.down("xs")]: {
      color: "#004777"
    },
  },
  divider:{
    backgroundColor: "#fff"
  }


}));

const MainNavigation = () => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const [OpenDrawer, SetOpenDrawer] = useState(false);

  
  const HandleDrawer = () => {
    SetOpenDrawer(!OpenDrawer);
  };

  const drawerItems = (
    <List style={{ margin: "2rem auto" }}>
      <Tooltip
        title={OpenDrawer ? "" : "Inbox"}
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <ListItem
          button
          key="Inbox"
          onClick={() => {
            SetOpenDrawer(false);
          }}
          component={Link}
          to="/chat"
        >
          <ListItemIcon>
            <EmailIcon className = {classes.Navicon} />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>
      </Tooltip>
     
<Divider variant="middle" className={classes.divider}/>
     
     
      <Tooltip
        title={OpenDrawer ? "" : "Interviews"}
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <ListItem
          button
          key="Interviews"
          onClick={() => {
            SetOpenDrawer(false);
          }}
          component={Link}
          to="/interviews"
        >
          <ListItemIcon>
            <DvrIcon className = {classes.Navicon} />
          </ListItemIcon>
          <ListItemText primary="Interviews" />
        </ListItem>
      </Tooltip>
      <Divider variant="middle" className={classes.divider}/>
      <Tooltip
        title={OpenDrawer ? "" : "Reports"}
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <ListItem
          button
          key="Reports"
          onClick={() => {
            SetOpenDrawer(false);
          }}
        >
          <ListItemIcon>
            <ListAltIcon className = {classes.Navicon}/>
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
      </Tooltip>
      <Divider variant="middle" className={classes.divider}/>
      <Tooltip
        title={OpenDrawer ? "" : "Charts"}
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <ListItem
          button
          key="Charts"
          onClick={() => {
            SetOpenDrawer(false);
          }}
        >
          <ListItemIcon>
            <InsertChartIcon className = {classes.Navicon} />
          </ListItemIcon>
          <ListItemText primary="Charts" />
        </ListItem>
      </Tooltip>
    </List>
  );
  
  

  return (
    <div className={classes.root}>
      <CssBaseline />
      {!auth.isLoggedIn && <Navbar HandleDrawer={HandleDrawer} />}

      {auth.isLoggedIn && (
        <>
          <Navbar HandleDrawer={HandleDrawer} />
          <Hidden smUp implementation="css">
            <Drawer
              className={classes.drawer}
              open={OpenDrawer}
              onClose={() => SetOpenDrawer(false)}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <Toolbar />
              <div>{drawerItems}</div>
            </Drawer>
          </Hidden>
        </>
      )}
      {auth.isLoggedIn && (
        <Hidden xsDown implementation="css">
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
              paper: classes.drawerWidthLgSc,
            }}
          >
            <Toolbar />
            <div>{drawerItems}</div>
          </Drawer>
        </Hidden>
      )}
    </div>
  );
}

export default MainNavigation;