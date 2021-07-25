import React, { useEffect, useState, useContext, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import io from "socket.io-client";

import Auth from "./user/pages/Auth";
import Home from "./user/pages/Home";

import RTC from "./RTC";
import AdminHome from "./Admin/pages/AdminHome";

import MainNavigation from "./shared/components/NavigationElements/MainNavigation";
import { SocketContext } from "./shared/context/socket-context";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

import "./App.css";
const signUp = React.lazy(()=> import("./user/pages/signUp"));
const EmailVerification = React.lazy(()=> import("./user/pages/EmailVerification"));
const CodeVerification = React.lazy(()=> import("./user/pages/CodeVerification"));
const ResetPassword = React.lazy(()=> import("./user/pages/ResetPassword"));
const UserProfile = React.lazy(()=> import("./user/pages/UserProfile"));

const Faq = React.lazy(()=> import("./faq/pages/Faq"));

const Interview = React.lazy(()=> import("./Interviews/pages/Interview"));
const CreateInterview = React.lazy(()=> import("./Interviews/components/CreateInterview"));
const CandidateList = React.lazy(()=> import("./Interviews/components/CandidatesList"));
const ViewInterview = React.lazy(()=> import("./Interviews/pages/ViewInterview"));

const Chat = React.lazy(()=> import("./chat/pages/Chat"));

const Charts = React.lazy(()=> import("./charts/pages/Charts"));

const Certificate = React.lazy(()=> import("./certificates/pages/Certificate"));
const ViewCertificate = React.lazy(()=> import("./certificates/pages/ViewCertificate"));
const ReportProblem = React.lazy(()=> import("./ReportProblems/pages/ReportProblem"));

const Resume = React.lazy(()=> import("./Resumes/Pages/Resume"));

const VideoCall = React.lazy(()=> import("./Video Call/VideoCall"));

const ReportProblemAdmin = React.lazy(()=> import("./Admin/Components/ReportProblems/pages/ReportProblemAdmin"));
const SideBar = React.lazy(()=> import("./Admin/Components/SideBar"));
const ViewFaqs = React.lazy(()=> import("./Admin/Components/Faqs/ViewFaqs"));
const ApproveCertificate = React.lazy(()=> import("./Admin/Components/ApproveCertificates/pages/ApproveCertificate"));

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
    if (setting && setting.role === "Admin") {
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
          {location.pathname === "/videocall" ? (
            ""
          ) : setting &&
            !auth.isLoggedIn &&
            setting.role === "Admin" &&
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

          <main><Suspense fallback={<LoadingSpinner open={true}/>}>{routes}</Suspense></main>
        </AuthContext.Provider>
      </SocketContext.Provider>
    </React.Fragment>
  );
};

export default App;
