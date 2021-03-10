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
} from "@material-ui/core";
import React, { Fragment, useContext, useState, useEffect } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Link } from "react-router-dom";
import SettingsIcon from "@material-ui/icons/Settings";
import Badge from '@material-ui/core/Badge';
import { FaQuestionCircle, FaBell} from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdArrowDropDownCircle } from "react-icons/md";
import { AiFillLock } from "react-icons/ai";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AuthContext } from "../../context/auth-context";




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
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  MoreIconButton: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
   customBadge: {
  //  backgroundColor: "#00AFD7",
    color: "white"
  }, 
  MainLogo: {
    flexGrow: 1
  }

}));
export default function Navbar(props) {
  const [NavSignUp, setNavSignup] = useState(true);

  const NavsignUpBtnHandler = () =>{
    setNavSignup(!NavSignUp)
  }

  const ProfileMenuItem = {
    width: "100%",
    marginRight: 80,
  };

  const auth = useContext(AuthContext);
  const classes = useStyles();

  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const [desktopMenuAnchorEl, setDesktopMenuAnchorEl] = useState(null);
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

  const mobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      id="mobile-menu"
      keepMounted
      open={isMobileMenuOpen}
      className={classes.MoreIconButton}
    >
      <MenuItem    onClick = {NavsignUpBtnHandler} component={Link} to= {NavSignUp? "/signup" : "/auth" }
                 >
        <IconButton color="primary">
          <AiFillLock />
        </IconButton>
        <Typography variant="subtitle1"> {NavSignUp ? "Sign Up" : "Sign In"} </Typography>
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
      <MenuItem style={ProfileMenuItem} component={Link} to="/profile">
        <Avatar
          src="https://data.whicdn.com/images/295658437/original.jpg"
          style={{ height: "70px", width: "70px", marginRight: 10 }}
        />
        <div>
          <Typography variant="h6">Urooj Tahir</Typography>
          <Typography variant="body1">See your profile</Typography>
        </div>
      </MenuItem>
      <MenuItem component={Link} to="/Faq" onClick={CloseNavbarMenu}>
        <IconButton color="primary">
          <FaQuestionCircle />
        </IconButton>
        <Typography variant="subtitle1">Help & Support</Typography>
      </MenuItem>
      <Divider variant="middle"/>
      <MenuItem component={Link} to="/Faq" onClick={CloseNavbarMenu}>
        <IconButton color="primary">
          <SettingsIcon />
        </IconButton>
        <Typography variant="subtitle1">Settings</Typography>
      </MenuItem>
      <Divider variant="middle" />
      <MenuItem onClick={auth.logout}>
        <IconButton color="primary">
          <IoLogOut />
        </IconButton>
        <Typography variant="subtitle1">Log Out</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Fragment>
      <AppBar position="fixed" className={classes.navbar} >
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
            {!auth.isLoggedIn &&(
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  component={Link}
                  to= {NavSignUp? "/signup" : "/auth" }
                  onClick = {NavsignUpBtnHandler}
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
                {mobileMenu}
              </>
            )}
          </div>

          {auth.isLoggedIn && (
            <>
              <IconButton color="inherit">
              <Badge badgeContent={4} color="error" >
                <FaBell />
                </Badge>
              </IconButton>
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
