import React, {useContext} from "react";
import Basic from "../Components/Left/Basic";
import Right from "../Components/Right/Right";
import "./Resume.css";
import ResumeContextProvider from "../Contexts/ResumeContext";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Templates from "../Components/Templates";
import { Toolbar } from "@material-ui/core";
import { AuthContext } from "../../shared/context/auth-context";

function App(props) {
  const auth = useContext(AuthContext);
  const appstyle = {
    marginTop: "7%",
  }


  let Routes,Data;
  if(!(props.location.state && props.location.state.resume.id!=auth.resume.id)){
    Data=props.location.state;
    Routes=(
      <Switch>
      {/* <Route path="/resume" component={Templates} exact /> */}
      <Route path="/resume" component={Templates} exact />
      <Route path="/resume/header" component={Basic} exact />
    </Switch>
    )
  }

  return (
  <>
    <Toolbar/>
    <div className="app" style={appstyle}>
      {/* <Toolbar /> */}
      <ResumeContextProvider>
        <BrowserRouter>
          {Routes}
        </BrowserRouter>
        <Right data={props.location.state} />
      </ResumeContextProvider>

    </div>
    </>
  );
}

export default App;
