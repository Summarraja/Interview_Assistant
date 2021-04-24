import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Auth from "./user/pages/Auth";
import signUp from "./user/pages/signUp";
import EmailVerification from "./user/pages/EmailVerification";
import CodeVerification from "./user/pages/CodeVerification";
import ResetPassword from "./user/pages/ResetPassword";
import Faq from "./faq/pages/Faq";
import MainNavigation from "./shared/components/NavigationElements/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import {SocketContext} from "./shared/context/socket-context";
import { useAuth } from "./shared/hooks/auth-hook";
import UserProfile from "./user/pages/UserProfile";
import Interview from "./Interviews/pages/Interview";
import CreateInterview from "./Interviews/components/CreateInterview";
import Chat from "./chat/pages/Chat";
import CandidateList from "./Interviews/components/CandidatesList";
import ViewInterview from "./Interviews/pages/ViewInterview";
import Resume from "./Resumes/Pages/Resume";
import CreateResume from "./Resumes/Components/CreateResume";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import Certificate from "./certificates/pages/Certificate";
import InterviewItems from "./Interviews/components/InterviewItems";
import ViewCertificate from "./certificates/pages/ViewCertificate";
import io from "socket.io-client";
import theme from './shared/components/UIElements/AppTheme/theme';

const App = () => {
  const { token, login, logout, userId, resume, setting } = useAuth();
  const [socket,setSocket] = useState();
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/Faq" exact component={Faq} />
        <Route path="/profile" exact component={UserProfile} />
        <Route path="/interviews" exact component={Interview} />
        <Route path="/chat" exact component={Chat} />
        <Route path="/interviews/new" exact component={CreateInterview} />
        <Route path="/interview/candidates" exact component={CandidateList} />
        <Route path="/interviews/:interId" exact component={ViewInterview} />
        <Route path="/certificates" exact component={Certificate} />
        <Route path="/certificates/:certId" exact component={ViewCertificate} />
        <Route path="/resume" exact component={Resume} />

        <Redirect to="/" />
      </Switch>
    );
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
        <Route path="/Reset" exact component={ResetPassword} />
        <Route path="/Faq" exact component={Faq} />
        <Route path="/resume" exact component={Resume} />
        <Redirect to="/auth" />
      </Switch>
    );
  }
  useEffect(() => {
    if (userId) {
      setSocket(io.connect("http://localhost:5000", { query: "id=" + userId }));
      // socket.current.emit("client", { id: userId })
      // socket.current.on("hey", (data) => {
      //   console.log(data);
      // })
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
          setting: setting
        }}
      >
        <Router>
          <MainNavigation />
          <main>{routes}</main>
        </Router>
      </AuthContext.Provider>
      </SocketContext.Provider>
    </React.Fragment>
  );
};

export default App;
