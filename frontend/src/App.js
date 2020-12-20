import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import {useMediaQuery } from 'react-responsive';

import Chat from './chat/components/Chat';
import Users from './user/pages/Users';
import NewPlace from './interviews/pages/NewPlace';
import UserInterviews from './interviews/pages/UserPlaces';
import UpdatePlace from './interviews/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

import SideNav from './shared/components/Navigation/SideNav';

const App = () => {
  const { token, login, logout, userId } = useAuth();
  const isBigScreen = useMediaQuery({ query: '(min-device-width: 1224px)' });
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:uid/interviews" exact>
          <UserInterviews />
        </Route>
        <Route path="/interviews/new" exact>
          <NewPlace />
        </Route>
        <Route path="/chat">
          <Chat />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
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
      }}
    >
      <Router>
        <MainNavigation />

        {!!token && isBigScreen&& <SideNav  />}
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
