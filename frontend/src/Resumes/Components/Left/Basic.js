import React, { useContext } from "react";
import Header from "./Header";
import Professional from "./Professional";
import Education from "./Education";
import AdditionalSkills from "./AdditionalSkills";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import myClasses from "./Left.module.css";
// import logo from "../../assets/default.png";
import { ResumeContext } from "../../Contexts/ResumeContext";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  rootAdd: {
    background: "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px #F2F3F4",
    color: "white",
    height: 30,
    textAlign: "center",
    fontSize: 10,
    margin:20,
    fontWeight: 700,
  },
  rootRemove: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 30,
    textAlign: "center",
    minWidth: 130,
    fontSize: 10,
    margin:20,
    fontWeight: 700,
  },

  headerLink: {
    color: "#0298B8 ",
  },
});

function Left() {
  const { control, addFakeData, removeFakeData } = useContext(ResumeContext);
  const classes = useStyles();

  function useFakeData(e) {
    e.preventDefault();
    addFakeData();
  }

  function clearFakeData(e) {
    e.preventDefault();
    removeFakeData();
  }

  let expData;
  if (control) {
    expData = (
      <Button
        color="secondary"
        onClick={clearFakeData}
        className={classes.rootRemove}
        // style={{ marginTop: 15, marginRight: 20, height: "auto" }}
      >
        remove example
      </Button>
    );
  } else {
    expData = (
      <Button
        color="primary"
        onClick={useFakeData}
        className={classes.rootAdd}
        // style={{ marginTop: 15, marginRight: 20, height: "auto" }}
      >
        example
      </Button>
    );
  }

  return (
    <div className="left">
      <div className={myClasses.headerLeft}>
        <div styles={{ flexGrow: 2 }}>
          {/* <Link to="/" style={{ display: "inline" }}>
            <img src={logo} alt="logo" />
          </Link> */}
        </div>
        <div styles={{ flexGrow: 1 }}>{expData}</div>
      </div>

      <div className="">
        <Router>
          <div className={myClasses.topLeft}>
            <Button
              className={classes.headerLink}
              component={Link}
              to="/resume/header"
            >
              Header
            </Button>
            <Button
              className={classes.headerLink}
              component={Link}
              to="/resume/professional"
            >
              Experience
            </Button>
            <Button
              className={classes.headerLink}
              component={Link}
              to="/resume/education"
            >
              Education
            </Button>
            <Button
              className={classes.headerLink}
              component={Link}
              to="/resume/additional"
            >
              Skills
            </Button>
          </div>
          <div>
            <hr className={myClasses.hr} />
            <div className={myClasses.formsSection}>
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                <Route path="/resume/header" component={Header}>
                </Route>
                <Route path="/resume/professional">
                  <Professional />
                </Route>
                <Route path="/resume/education">
                  <Education />
                </Route>
                <Route path="/resume/additional">
                  <AdditionalSkills />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default Left;
