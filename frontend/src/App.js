import React, { useEffect, useState, useContext } from "react";
import "./App.css";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import Auth from "./user/pages/Auth";
import signUp from "./user/pages/signUp";
import EmailVerification from "./user/pages/EmailVerification";
import CodeVerification from "./user/pages/CodeVerification";
import ResetPassword from "./user/pages/ResetPassword";
import Faq from "./faq/pages/Faq";
import MainNavigation from "./shared/components/NavigationElements/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { SocketContext } from "./shared/context/socket-context";

import { useAuth } from "./shared/hooks/auth-hook";
import UserProfile from "./user/pages/UserProfile";
import Interview from "./Interviews/pages/Interview";
import CreateInterview from "./Interviews/components/CreateInterview";
import Chat from "./chat/pages/Chat";
import Charts from "./charts/pages/Charts";
import CandidateList from "./Interviews/components/CandidatesList";
import ViewInterview from "./Interviews/pages/ViewInterview";

import Certificate from "./certificates/pages/Certificate";
import ViewCertificate from "./certificates/pages/ViewCertificate";
import io from "socket.io-client";

import AdminHome from "./Admin/pages/AdminHome";

import ReportProblem from "./ReportProblems/pages/ReportProblem";
import ReportProblemAdmin from "./Admin/Components/ReportProblems/pages/ReportProblemAdmin";

import RTC from "./RTC";
import Resume from "./Resumes/Pages/Resume";
import VideoCall from "./Video Call/VideoCall";
import Home from "./user/pages/Home";
import SideBar from "./Admin/Components/SideBar";
import ViewFaqs from "./Admin/Components/Faqs/ViewFaqs";
import ApproveCertificate from "./Admin/Components/ApproveCertificates/pages/ApproveCertificate";


const App = () => {
  let location = useLocation();
  const {
    token,
    login,
    logout,
    userId,
    resume,
    setting,
    updateResume,
    updateSetting,
  } = useAuth();
  const auth = useContext(AuthContext);
  const [socket, setSocket] = useState();

  let routes;
  if (token) {
    if (setting && setting.role == "Admin") {
      routes = (
        <Switch>
          <Route path="/admin/home" exact component={AdminHome} />
          <Route
            path="/admin/certificates"
            exact
            component={ApproveCertificate}
          />
          <Route
            path="/certificates/edit/:certId"
            exact
            component={ViewCertificate}
          />
          <Route path="/admin/faq" exact component={ViewFaqs} />
          <Route
            path="/admin/reportProblem"
            exact
            component={ReportProblemAdmin}
          />
          <Redirect to="/admin/home" />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route path="/Faq" exact component={Faq} />
          <Route path="/" exact component={Home} />
          <Route path="/profile" exact component={UserProfile} />
          <Route path="/profile/:uid" exact component={UserProfile} />
          <Route path="/interviews/:uid" exact component={Interview} />
          <Route path="/chat" exact component={Chat} />
          <Route path="/charts" exact component={Charts} />
          <Route path="/interviews/new" exact component={CreateInterview} />
          <Route path="/interview/candidates" exact component={CandidateList} />

          <Route
            path="/interviews/view/:interId"
            exact
            component={ViewInterview}
          />
          <Route path="/certificates/:uid" exact component={Certificate} />
          <Route
            path="/certificates/edit/:certId"
            exact
            component={ViewCertificate}
          />
          <Route path="/resume" exact component={Resume} />
          <Route path="/videocall" exact component={VideoCall} />
          <Route path="/reportproblem" exact component={ReportProblem} />
          <Redirect to="/" />
        </Switch>
      );
    }
  } else {
    routes = (
      <Switch>
        <Route path="/signup" exact component={signUp} />
        <Route path="/auth" exact component={Auth} />
        <Route
          path="/verifyemail"
          exact
          component={(props) => <EmailVerification {...props} />}
        />
        <Route
          path="/forgotpassword"
          exact
          component={(props) => <EmailVerification {...props} />}
        />
        <Route
          path="/verifycode"
          exact
          component={(props) => <CodeVerification {...props} />}
        />
        <Route path="/Reset"
         exact 
         component={(props) => <ResetPassword {...props}/>} 
        />
        <Route path="/Faq" exact component={Faq} />
        <Redirect to="/auth" />
      </Switch>
    );
  }
  useEffect(() => {
    if (userId) {
      setSocket(io.connect("http://localhost:5000", { query: "id=" + userId }));
    }
  }, [userId]);

  return (
    <React.Fragment>
      <SocketContext.Provider value={socket}>
        <AuthContext.Provider
          value={{
            isLoggedIn: !!token,
            token: token,
            userId: userId,
            login: login,
            logout: logout,
            resume: resume,
            setResume: updateResume,
            setting: setting,
            setSetting: updateSetting,
          }}
        >
          {location.pathname == "/videocall" ? (
            ""
          ) : setting &&
            !auth.isLoggedIn &&
            setting.role == "Admin" &&
            location.pathname !== "/auth" &&
            location.pathname !== "/Faq" && 
            location.pathname !== "/forgotpassword" && 
            location.pathname !== "/verifycode" && 
            location.pathname !== "/Reset" && 
            location.pathname !== "/signup"? (
            <SideBar />
          ) : (
            <>
              <RTC />
              <MainNavigation />
            </>
          )}

          <main>{routes}</main>
        </AuthContext.Provider>
      </SocketContext.Provider>
    </React.Fragment>
  );
};

export default App;
