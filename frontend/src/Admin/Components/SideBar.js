import React, { useContext } from 'react';
import { makeStyles, fade } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { Link } from "react-router-dom";
import { AuthContext } from '../../shared/context/auth-context';
import { Button } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  button: {
    margin: "auto 8px",
     [theme.breakpoints.up("xs")]: {
      display: "flex",
    }
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 1),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.75),
    },
    width: "400px",
    height: "40px",
    margin: theme.spacing(0, 6),
    [theme.breakpoints.up("sm")]: {
     // margin: theme.spacing(0, 15),
      width: "auto",
    },
    [theme.breakpoints.up("md")]: {
    //  margin: theme.spacing(0, 25),
      width: "auto",
    },
    [theme.breakpoints.up("lg")]: {
      margin: theme.spacing(0, 40),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  },
  inputRoot: {
    color: "inherit",
    height: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
      "&:focus": {
        width: "auto",
      },
    },
  },
  listicon:{
minWidth:"40px",

  },

  list: {
     padding:0 
  },
  MainLogo: {
    flexGrow: 1,
    color: "#fff",
  },

}));

export default function ClippedDrawer() {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  const logout=()=>{
    auth.logout();
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed"className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" className = {classes.MainLogo}>
           Admin 
          </Typography>
          <Button 
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={logout}
                >
                  LogOut
                </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List className={classes.list}>        
              <ListItem button style={{margin:"0px"}}
              component={Link}
              to="/admin/home" >
                <ListItemIcon className={classes.listicon}>
                <HomeRoundedIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
          </List>
          
          <Divider />

          <List className={classes.list}>        
              <ListItem
              button
              component={Link}
              to="/admin/certificates" > 
                <ListItemIcon  className={classes.listicon}>
                <VerifiedUserIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Approve Certificates" />
              </ListItem>
          </List>

          <Divider />

          <List className={classes.list}>        
              <ListItem button 
              component={Link}
              to="/admin/reportProblem">
                <ListItemIcon  className={classes.listicon}>
        <ReportProblemIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Reported Problems" />
              </ListItem>
          </List>

          <Divider />
        
          <List className={classes.list}>        
              <ListItem button
                 component={Link}
                 to=  "/admin/faq" >
                <ListItemIcon  className={classes.listicon}>
                <LiveHelpIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="FAQS" />
              </ListItem>
          </List>
          <Divider />
        
        </div>
      </Drawer>
      {/* <main className={classes.content}>
        <Toolbar />
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search Users"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
      </main> */}
    </div>
  );
}
