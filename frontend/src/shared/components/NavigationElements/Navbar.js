import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  Typography,
  AppBar,
  Toolbar,
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Hidden,
} from "@material-ui/core";
import OutsideClickHandler from "react-outside-click-handler";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Link, Redirect, useHistory } from "react-router-dom";
import SettingsIcon from "@material-ui/icons/Settings";
import Badge from "@material-ui/core/Badge";
import { FaQuestionCircle, FaBell } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdArrowDropDownCircle } from "react-icons/md";
import { AiFillLock, AiOutlineUserSwitch } from "react-icons/ai";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AuthContext } from "../../../shared/context/auth-context";
import { useAuth } from "../../../shared/hooks/auth-hook";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { IoIosSwitch } from "react-icons/io";
import { useHttpClient } from "../../hooks/http-hook";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { SocketContext } from "../../../shared/context/socket-context";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import UserBlockedListDialog from "../../../user/components/UserBlockedListDialog";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: "auto 8px",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  navbar: {
    zIndex: theme.zIndex.drawer + 1,
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up("sm")]: {
      display: "none",
      marginRight: theme.spacing(2),
    },
  },
  MoreIconButton: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  MainLogo: {
    flexGrow: 1,
    color: "#fff",
  },
  switchControl: {
    marginRight: "0px",
    marginLeft: "2px",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  root: {
    paddingBottom: "0px",
  },
  gutters: {
    // paddingRight: "10px",
    marginRight: "0px",
  },
  switchBase: {
    color: "#fff",
    "&$checked": {
      color: "white",
    },
    "_&$checked + $track": {
      backgroundColor: "white",
    },
    get "&$checked + $track"() {
      return this["_&$checked + $track"];
    },
    set "&$checked + $track"(value) {
      this["_&$checked + $track"] = value;
    },
  },
  checked: {
    color: "#fff",
  },
  track: {
    backgroundColor: "#fff",
  },
}));

export default function Navbar(props) {
  const [NavSignUp, setNavSignup] = useState(true);
  const auth = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const { login } = useAuth();

  const history = useHistory();
  const [success, setSuccess] = useState(false);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [role, setRole] = useState("Candidate");
  const [switchResMsg, setSwitchResMsg] = useState("");
  const [callblockedDialog, setCallblockedDialog] = useState(false);
  const [openBlockedDialog, setOpenBlockedDialog] = useState(false);
  const [blockedUsers, setBlockedUsers] =useState([]);

  const CallCompHandler = () => {
    setCallblockedDialog(true);
    setOpenBlockedDialog(true);
  };

  const clearSuccess = () => {
    setSuccess(false);
  };
  const logout = () => {
    auth.logout();
    socket.disconnect();
  };
  useEffect(() => {
    setSuccess(status == 200 && switchResMsg);
  }, [status]);

  useEffect(() => {
    if (auth.setting) setRole(auth.setting.role);
  }, [auth.setting]);

  const NavsignUpBtnHandler = () => {
    setNavSignup(!NavSignUp);
  };

  const ProfileMenuItem = {
    marginRight: "10px",
  };

  const classes = useStyles();

  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(false);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const [desktopMenuAnchorEl, setDesktopMenuAnchorEl] = useState(false);
  const isNavMenuOpen = Boolean(desktopMenuAnchorEl);
  const [settingMenuAnchorEl, setSettingMenuAnchorEl] = useState(false);
  const isSettingMenuOpen = Boolean(settingMenuAnchorEl);
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const openMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };
  const closeMobileMenu = () => {
    setMobileMenuAnchorEl(null);
  };

  function OpenNavbarMenu(event) {
    setDesktopMenuAnchorEl(event.currentTarget);
  }

  const CloseNavbarMenu = () => {
    if (settingMenuAnchorEl) {
      return;
    } else setDesktopMenuAnchorEl(null);
  };

  function OpenSettingMenu(event) {
    setSettingMenuAnchorEl(event.currentTarget);
  }

  const CloseSettingMenu = () => {
    setSettingMenuAnchorEl(null);
  };

  const Reporthandler = () => {
    console.log("report");
  };
  const matches = useMediaQuery("(min-width:960px)");

  useEffect(() => {
    if (matches) setMobileMenuAnchorEl(null);
  }, [matches]);

  const switchRole = () => {
    const SetRole = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/settings/role/${auth.setting._id}`,
          "PATCH",
          JSON.stringify({
            role: role == "Candidate" ? "Interviewer" : "Candidate",
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setSwitchResMsg(responseData.responseMessage)
        if (responseData.setting) {
          const storedData = JSON.parse(localStorage.getItem("userData"));
          login(
            storedData.userId,
            storedData.token,
            storedData.resume,
            responseData.setting
          );
        }
        history.go(0);
      } catch (err) {}
    };
    SetRole();
  };

 

      const GetBlockedUsersHandler= async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/settings/blockedUsers/${auth.userId}`,
            "GET",
            null,
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          setBlockedUsers(responseData.blockedUsers);
        } catch (err) {
          console.log(err);
        }
        CallCompHandler();
      };
      



  


  const settingMenu = (
    <Menu
      anchorEl={settingMenuAnchorEl}
      id="mobile-menu"
      keepMounted
      open={isSettingMenuOpen}
      // anchorOrigin={{
      //   vertical: 'center',
      //   horizontal: 'left',
      // }}
      transformOrigin={{
        vertical: -15,
        horizontal: -200,
      }}
      // className={classes.MoreIconButton}
    >
      <MenuItem
        onClick={Reporthandler}
        // component={Link}
        // to={NavSignUp ? "/signup" : "/auth"}
      >
        <IconButton color="primary">
          <AiFillLock />
        </IconButton>
        <Typography variant="subtitle1">Report Problem</Typography>
      </MenuItem>
     

      <Divider variant="middle" />
      <MenuItem onClick={GetBlockedUsersHandler} >
        <IconButton color="primary">
          <FaQuestionCircle />
        </IconButton>
        <Typography variant="subtitle1">View Blocked Users</Typography>
      </MenuItem>
      {callblockedDialog &&(
            <UserBlockedListDialog
            openBlockedDialog={openBlockedDialog}
            setOpenBlockedDialog={setOpenBlockedDialog}
            blockedUsers= {blockedUsers}
            />
          )}
    </Menu>
  );

  const mobileMenuBeforeLogin = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      id="mobile-menu"
      keepMounted
      open={isMobileMenuOpen}
      className={classes.MoreIconButton}
    >
      <MenuItem
        onClick={NavsignUpBtnHandler}
        component={Link}
        to={NavSignUp ? "/signup" : "/auth"}
      >
        <IconButton color="primary">
          <AiFillLock />
        </IconButton>
        <Typography variant="subtitle1">
          {" "}
          {NavSignUp ? "Sign Up" : "Sign In"}{" "}
        </Typography>
      </MenuItem>
      <MenuItem  component={Link} to="/Faq">
        <IconButton color="primary">
          <FaQuestionCircle />
        </IconButton>
        <Typography variant="subtitle1">Help & Support</Typography>
      </MenuItem>

      <MenuItem  component={Link} to="/reportproblem">
        <IconButton color="primary">
          <FaQuestionCircle />
        </IconButton>
        <Typography variant="subtitle1">Report a Problem</Typography>
      </MenuItem>
      
    </Menu>
  );

  const desktopMenu = (
    <Menu
      anchorEl={desktopMenuAnchorEl}
      open={isNavMenuOpen}
      keepMounted
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      // anchorOrigin={{
      //   vertical: 'top',
      //   horizontal: 'left',
      // }}
      transformOrigin={{
        vertical: -10,
        horizontal: 230,
      }}
      getContentAnchorEl={null}
    >
      <MenuItem
        classes={{ root: classes.root, gutters: classes.gutters }}
        style={ProfileMenuItem}
        component={Link}
        to="/profile"
      >
        {auth.resume && (
          <Avatar
            src={"http://localhost:5000/" + auth.resume.image}
            alt={null}
            style={{ height: "70px", width: "70px", marginRight: 10 }}
          />
        )}
        <div>
          <Typography variant="h6">
            {auth.resume && auth.resume.fullname}
          </Typography>
          <Typography variant="body1">See your profile</Typography>
        </div>
      </MenuItem>
      <MenuItem
        className={classes.root}
        component={Link}
        to="/Faq"
        onClick={CloseNavbarMenu}
      >
        <IconButton color="primary">
          <FaQuestionCircle />
        </IconButton>
        <Typography variant="subtitle1">Help & Support</Typography>
      </MenuItem>

      <MenuItem
        className={classes.root}
        component={Link} to="/reportproblem">
        <IconButton color="primary">
          <FaQuestionCircle />
        </IconButton>
        <Typography variant="subtitle1">Report a Problem </Typography>
      </MenuItem>

      <Divider variant="middle" />
      <Hidden smUp implementation="css">
        <MenuItem className={classes.root} onClick={switchRole}>
          <IconButton color="primary">
            <IoIosSwitch />
          </IconButton>
          <Typography variant="subtitle1">
            Switch to {role == "Candidate" ? "Interviewer" : "Candidate"}
          </Typography>
        </MenuItem>
        <Divider variant="middle" />
      </Hidden>

      <OutsideClickHandler onOutsideClick={CloseSettingMenu}>
        <MenuItem className={classes.root} onClick={OpenSettingMenu}>
          <IconButton color="primary">
            <SettingsIcon />
          </IconButton>
          <Typography variant="subtitle1">Settings</Typography>
        </MenuItem>
      </OutsideClickHandler>
      {settingMenu}

      <Divider variant="middle" />
      <MenuItem className={classes.root} onClick={logout}>
        <IconButton color="primary">
          <IoLogOut />
        </IconButton>
        <Typography variant="subtitle1">Log Out</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Fragment>
      <LoadingSpinner open={isLoading} />

      <Snackbar
        open={success || !!error}
        autoHideDuration={1200}
        onClose={status == "200" ? clearSuccess : clearError}
      >
        <MuiAlert
          elevation={6}s
          variant="filled"
          severity={status == "200" ? "success" : "error"}
          onClose={status == "200" ? clearSuccess : clearError}
        >
          {status == "200" && switchResMsg
            ? `Your role has been swtiched to ${
                role == "Candidate" ? "Interviewer" : "Candidate"
              }`
            : error}
        </MuiAlert>
      </Snackbar>

      <AppBar position="fixed" className={classes.navbar}>
        <Toolbar>
          {auth.isLoggedIn && (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={props.HandleDrawer}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h4" className={classes.MainLogo}>
            SmartHire
          </Typography>

          <div className={classes.sectionDesktop}>
            {!auth.isLoggedIn && (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  component={Link}
                  to={NavSignUp ? "/signup" : "/auth"}
                  onClick={NavsignUpBtnHandler}
                >
                  {NavSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <IconButton color="secondary" component={Link} to="/Faq">
                  <FaQuestionCircle />
                </IconButton>
              </>
            )}
          </div>

          <div className={classes.sectionMobile}>
            {!auth.isLoggedIn && (
              <>
                <OutsideClickHandler onOutsideClick={closeMobileMenu}>
                  <IconButton color="inherit" onClick={openMobileMenu}>
                    <MoreIcon />
                  </IconButton>
                </OutsideClickHandler>
                {mobileMenuBeforeLogin}
              </>
            )}
          </div>

          {auth.isLoggedIn && (
            <>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <FaBell />
                </Badge>
              </IconButton>

              <FormGroup row>
                <FormControlLabel
                  className={classes.switchControl}
                  control={
                    <Switch
                      checked={role == "Candidate"}
                      onChange={switchRole}
                      name="checked"
                      classes={{
                        switchBase: classes.switchBase,
                        thumb: classes.thumb,
                        track: classes.track,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label={role}
                />
              </FormGroup>
              {/* <OutsideClickHandler onOutsideClick={CloseNavbarMenu}> */}
              <ClickAwayListener onClickAway={CloseNavbarMenu}>
                <IconButton color="inherit" onClick={OpenNavbarMenu}>
                  <MdArrowDropDownCircle />
                </IconButton>
              </ClickAwayListener>
              {/* </OutsideClickHandler> */}

              {desktopMenu}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
