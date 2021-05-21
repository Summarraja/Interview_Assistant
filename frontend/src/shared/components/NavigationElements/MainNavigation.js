import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
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
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import Hidden from "@material-ui/core/Hidden";
import { Divider } from "@material-ui/core";
import { AuthContext } from "../../context/auth-context";
import { SocketContext } from "../../context/socket-context";
import { Link } from "react-router-dom";
import { IoRibbonOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { ImProfile } from "react-icons/im";
import { TiMessages } from "react-icons/ti";
import Badge from "@material-ui/core/Badge";
import { useHttpClient } from "../../hooks/http-hook";
import { useHistory } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";

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
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
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
  Navicon: {
    fontSize: "2rem",
    color: "#fff",
    [theme.breakpoints.down("xs")]: {
      color: "#004777",
    },
  },
  divider: {
    backgroundColor: "#fff",
  },
}));

const MainNavigation = () => {
  const auth = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const classes = useStyles();
  const [OpenDrawer, SetOpenDrawer] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);
  let history = useHistory();

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      setUnreadChats(unreadChats + 1);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  useEffect(() => {
    if (!auth.userId) return;
    getBadges();
  }, [auth.userId]);
  const getBadges = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/settings/notifications/${auth.userId}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setUnreadChats(responseData.unreadChats);
    } catch (err) {}
  };
  const openChat = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/settings/openChat/${auth.userId}`,
        "PATCH",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setUnreadChats(responseData.unreadChats);
    } catch (err) {}
  };
  const HandleDrawer = () => {
    SetOpenDrawer(!OpenDrawer);
  };

 // console.log("GO: "+history.goBack())
  const drawerItems = (

    <List >
      <Tooltip
        title="Back"
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}

      >
        <IconButton
          className={classes.Navicon}
          onClick={() => history.goBack()}
        >
          <IoIosArrowDropleft
             style={{ margin: "0px 0px 20px 5px" }}
          />
        </IconButton>
      </Tooltip>

      <Tooltip
        title={OpenDrawer ? "" : "Home"}
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <ListItem
          button
          key="Home"
          onClick={() => {
            SetOpenDrawer(false);
          }}
          component={Link}
          to="/"
        >
          <ListItemIcon>
            <GoHome className={classes.Navicon} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Tooltip>

      <Divider variant="middle" className={classes.divider} />

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
            openChat();
            SetOpenDrawer(false);
          }}
          component={Link}
          to="/chat"
        >
          <ListItemIcon>
            <Badge badgeContent={unreadChats} color="error">
              <TiMessages className={classes.Navicon} />
            </Badge>
          </ListItemIcon>

          <ListItemText primary="Inbox" />
        </ListItem>
      </Tooltip>

      <Divider variant="middle" className={classes.divider} />

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
          to={`/interviews/${auth.userId}`}
        >
          <ListItemIcon>
            <Badge badgeContent={4} color="error">
              <DvrIcon className={classes.Navicon} />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Interviews" />
        </ListItem>
      </Tooltip>
      <Divider variant="middle" className={classes.divider} />
      <Tooltip
        title={OpenDrawer ? "" : "Certificates"}
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <ListItem
          button
          key="Certificates"
          onClick={() => {
            SetOpenDrawer(false);
          }}
          component={Link}
          to={`/certificates/${auth.userId}`}
        >
          <ListItemIcon>
            <IoRibbonOutline className={classes.Navicon} />
          </ListItemIcon>
          <ListItemText primary="Certificates" />
        </ListItem>
      </Tooltip>
      <Divider variant="middle" className={classes.divider} />
      <Tooltip
        title={OpenDrawer ? "" : "Resume"}
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <ListItem
          button
          key="Resume"
          onClick={() => {
            SetOpenDrawer(false);
          }}
          component={Link}
          to="/resume"
        >
          <ListItemIcon>
            <ImProfile className={classes.Navicon} />
          </ListItemIcon>
          <ListItemText primary="Resume" />
        </ListItem>
      </Tooltip>
      <Divider variant="middle" className={classes.divider} />

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
            <InsertChartIcon className={classes.Navicon} />
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
};

export default MainNavigation;
