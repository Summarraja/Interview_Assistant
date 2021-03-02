import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Auth from './user/pages/Auth';
import signUp from './user/pages/signUp';
import ForgetPassword from './user/pages/ForgetPassword';
import EmailVerification from './user/pages/EmailVerification';
import ResetPassword from './user/pages/ResetPassword';
import Faq from './faq/pages/Faq';
import MainNavigation from './shared/components/NavigationElements/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import UserProfile from './user/pages/UserProfile';
import Interview from './Interviews/pages/Interview';
import CreateInterview from './Interviews/components/CreateInterview';
import Chat from './chat/pages/Chat';
import CandidateList from './Interviews/components/CandidatesList';



const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/Faq" exact component={Faq} />
        <Route path="/profile" exact component={UserProfile} />
        <Route path="/interviews" exact component={Interview} />
        <Route path="/chat" exact component={Chat} />
        <Route path="/interviews/new" exact component={CreateInterview} />
        <Route path="/interview/candidates" exact component ={CandidateList}/>
        
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/signup" exact component={signUp} />
        <Route path="/auth" exact component={Auth} />
        <Route path="/forgot" exact component={ForgetPassword} />
        <Route path="/verifyEmail" exact component={EmailVerification} />
        <Route path="/Reset" exact component={ResetPassword} />
        <Route path="/Faq" exact component={Faq} />
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}>
      <Router>
        <MainNavigation />
        <main>
          {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;