import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  resume:null,
  setting: null,
  token: null,
  login:  () => {},
  logout: () => {}
});
 