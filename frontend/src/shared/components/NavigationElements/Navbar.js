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
import React, { Fragment, useContext, useState, useEffect } from "react";
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
  const { token, login, logout, userId, resume, setting } = useAuth();

  const history = useHistory();
  const [success, setSuccess] = useState(false);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [role, setRole] = useState("Candidate");

  const clearSuccess = () => {
    setSuccess(false);
  };

  useEffect(() => {
    setSuccess(status == 200);
  }, [status]);

  useEffect(() => {
    if (auth.setting)
      setRole(auth.setting.role);
  }, [auth.setting]);

  const switchRole = () => {
    const SetRole = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/settings/role/${auth.setting._id}`,
          "PATCH",
          JSON.stringify({
            role: (role == 'Candidate') ? "Interviewer" : "Candidate",
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        if (responseData.setting){
          const storedData = JSON.parse(localStorage.getItem('userData'));
          login(storedData.userId, storedData.token, storedData.resume, responseData.setting);
        }
        history.go(0);
      } catch (err) {
       }
    };
    SetRole();
  };

  const NavsignUpBtnHandler = () => {
    setNavSignup(!NavSignUp);
  };

  const ProfileMenuItem = {
    //  width: "100%",
    marginRight: "10px",
  };

  const classes = useStyles();

  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(false);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const [desktopMenuAnchorEl, setDesktopMenuAnchorEl] = useState(false);
  const isNavMenuOpen = Boolean(desktopMenuAnchorEl);

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
    setDesktopMenuAnchorEl(null);
  };

  const matches = useMediaQuery("(min-width:960px)");

  useEffect(() => {
    if (matches) setMobileMenuAnchorEl(null);
  }, [matches]);

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
      <MenuItem onClick={closeMobileMenu} component={Link} to="/Faq">
        <IconButton color="primary">
          <FaQuestionCircle />
        </IconButton>
        <Typography variant="subtitle1">Help & Support</Typography>
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
        horizontal: "center",
      }}
      getContentAnchorEl={null}
    >
      <MenuItem
        classes={{ root: classes.root, gutters: classes.gutters }}
        style={ProfileMenuItem}
        component={Link}
        to="/profile"
      >
        <Avatar
          src={null}
          alt={null}
          style={{ height: "70px", width: "70px", marginRight: 10 }}
        />
        <div>
          <Typography variant="h6">
            {auth.resume && auth.resume.firstname + " " + auth.resume.lastname}
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

      <Divider variant="middle" />
      <Hidden smUp implementation="css">
        <MenuItem className={classes.root} onClick={switchRole}>
          <IconButton color="primary">
            <IoIosSwitch />
          </IconButton>
          <Typography variant="subtitle1">
            Switch to{" "}
            {role == "Candidate"? "Interviewer" : "Candidate"}
          </Typography>
        </MenuItem>
        <Divider variant="middle" />
      </Hidden>

      <MenuItem
        className={classes.root}
        component={Link}
        to="/Faq"
        onClick={CloseNavbarMenu}
      >
        <IconButton color="primary">
          <SettingsIcon />
        </IconButton>
        <Typography variant="subtitle1">Settings</Typography>
      </MenuItem>
      <Divider variant="middle" />
      <MenuItem className={classes.root} onClick={auth.logout}>
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
          elevation={6}
          variant="filled"
          severity={status == "200" ? "success" : "error"}
          onClose={status == "200" ? clearSuccess : clearError}
        >
          {status == "200"
            ? `Your role has been swtiched to ${role == "Candidate" ? "Interviewer" : "Candidate"}`
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

          <Typography variant="h5" className={classes.MainLogo}>
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
                      checked={role == 'Candidate'}
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
                  label={
                    role
                  }
                />
              </FormGroup>
              <OutsideClickHandler onOutsideClick={CloseNavbarMenu}>
                <IconButton color="inherit" onClick={OpenNavbarMenu}>
                  <MdArrowDropDownCircle />
                </IconButton>
              </OutsideClickHandler>
              {desktopMenu}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
