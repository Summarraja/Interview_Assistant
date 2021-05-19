import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  resume:null,
  setResume:()=>{},
  setting: null,
  setSetting:()=>{},
  token: null,
  login:  () => {},
  logout: () => {}
});
 