import React from "react";
import Basic from "../Components/Left/Basic";
import Right from "../Components/Right/Right";
import "./Resume.css";
import ResumeContextProvider from "../Contexts/ResumeContext";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Templates from "../Components/Templates";
import { Toolbar } from "@material-ui/core";



function App() {

const appstyle={
// marginTop:"40px"
marginLeft:"7%"

}


  return (
  <>
    <Toolbar/>
    <div className="app" style={appstyle}>
      <ResumeContextProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/resume" component={Templates} exact />
            <Route path="/resume/header" component={Basic} />
          </Switch>
        </BrowserRouter>
        <Right />
      </ResumeContextProvider>
    </div>
    </>
  );
}

export default App;
