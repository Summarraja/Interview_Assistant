import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, Divider } from "@material-ui/core";
import { IoMdEye } from "react-icons/io";
import { FaRegCheckCircle, FaStamp } from "react-icons/fa";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";
import OutsideClickHandler from "react-outside-click-handler";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IconButton from "@material-ui/core/IconButton";
import { grey } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import { GiShieldDisabled } from "react-icons/gi";

import { Link } from "react-router-dom";
import BlockIcon from "@material-ui/icons/Block";
import CertificateMenu from "./CertificateMenu";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    display: "flex",
    marginTop: "15px",
    padding: "10px 17px",
    // background:
    //   "linear-gradient( rgba(0, 27.8, 46.7, 0.7), rgba(78, 120, 160, 0.5))",
  },
  header: {
    flexGrow: 1,
  },
  ViewButton: {
    height: "35px",
    marginTop: "12px ",
    marginRight: "10px",
    [theme.breakpoints.up("sm")]: {
      float: "right",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  statusStyle: {
    background: "#4E78A0",
    color: "#fff",
    textAlign: "center",
    height: "35px",
    marginTop: "12px ",
    paddingTop: "5px",
    alignContent: "center",
    width: "140px",
    borderRadius: 4,
    float: "right",
  },
  statusIconStyle: {
    marginRight: "7px",
    transform: "translate(1px, 3px)",
    fontSize: "1rem",
  },
}));

const CertificateItem = (props) => {
  const MoreIconStyle = {
    marginTop: "5px",
  };

  const classes = useStyles();

  const [CertificateMobAnchorEl, setCertificateMobAnchorEl] = useState(null);
  const isCertificateMenuOpen = Boolean(CertificateMobAnchorEl);

  const openCertificateMenu = (event) => {
    setCertificateMobAnchorEl(event.currentTarget);
  };
  const closeCertificateMenu = () => {
    setCertificateMobAnchorEl(null);
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const CertificateMobileMenu = (
    <Menu
      anchorEl={CertificateMobAnchorEl}
      id="Int-mob-menu"
      keepMounted
      open={isCertificateMenuOpen}
      // anchorOrigin={{
      //   vertical: "right",
      //   horizontal: "bottom",
      // }}
      getContentAnchorEl={null}
    >
      {matches && (
        <>
        <MenuItem  component={Link} to="/Faq" style={{ height: 40 }}>
          <IconButton color="primary">
            <IoMdEye />
          </IconButton>
          <Typography variant="subtitle1">View Details</Typography>
        </MenuItem>
        <Divider variant="middle" />
        </>
        
      )}
    

      <CertificateMenu
        closeCertificateMenu={closeCertificateMenu}
        status={props.status}
      />
    </Menu>
  );

  return (
    <Card className={classes.card}>
      <Grid container spacing={5}>
        <Grid item sm={6} lg={7} style={{ flexGrow: 1 }}>
          <div className={classes.header}>
            <Typography variant="h5" align="justify">
              Certificate
            </Typography>
            <Typography variant="subtitle1" style={{ color: grey[900] }}>
              date
            </Typography>
          </div>
        </Grid>
      </Grid>
      <Grid item sm={6} lg={5}>
        <Typography variant="subtitle2" className={classes.statusStyle}>
          {(props.status === "APPROVED" && (
            <FaStamp className={classes.statusIconStyle} />
          )) ||
            (props.status === "UNAPPROVED" && (
              <GiShieldDisabled className={classes.statusIconStyle} />
            ))}
          {props.status}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.ViewButton}
          startIcon={<IoMdEye style={{ marginLeft: 6 }} />}
        //  component={Link}
         // to="/interview/view"
        >
          View Details
        </Button>
      </Grid>

      <OutsideClickHandler onOutsideClick={closeCertificateMenu}>
        <IconButton onClick={openCertificateMenu}>
          <MoreVertIcon style={MoreIconStyle} />
        </IconButton>
      </OutsideClickHandler> 
      {CertificateMobileMenu}
    </Card>
  );
};

export default CertificateItem;
