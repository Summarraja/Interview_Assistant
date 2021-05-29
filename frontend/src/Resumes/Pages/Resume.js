import React from "react";
import Basic from "../Components/Left/Basic";
import Right from "../Components/Right/Right";
import "./Resume.css";
import ResumeContextProvider from "../Contexts/ResumeContext";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import myClasses from "./../Components/Left/Left.module.css";
//import logo from "../../src/assets/default.png";
// import thumbn from "../../src/assets/templateA.png";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Templates from "../Components/Templates";
import { Toolbar } from "@material-ui/core";



function App() {
  return (
    <div className="app">
      <Toolbar/>
      <ResumeContextProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/resume" component={Templates} exact />
            <Route path="/resume/basic" component={Basic} />
          </Switch>
        </BrowserRouter>
        <Right />
      </ResumeContextProvider>
      
    </div>
  );
}

export default App;
