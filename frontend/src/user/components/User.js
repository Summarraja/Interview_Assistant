import React, {useContext}from "react";
import UserItem from "./UserItem";
import { AuthContext } from '../../shared/context/auth-context';

const Users = () => {
  const auth = useContext(AuthContext);
  // const USERS = [
  //   {
  //     id: "u1",
  //     name: "Muqaddas Pervez",
  //     city: "Islamabad",
  //     interviews: 4,
  //     certificates: 2,
  //     country: "Pakistan",
  //     profession: "Front-end Developer",
  //     image:
  //       "https://data.whicdn.com/images/295658437/original.jpg",
  //   },
  //   {
  //     id: "u1",
  //     name: "Muqaddas Pervez",
  //     city: "Islamabad",
  //     interviews: 4,
  //     certificates: 2,
  //     country: "Pakistan",
  //     profession: "Front-end Developer",
  //     image:
  //       "https://data.whicdn.com/images/295658437/original.jpg",
  //   },
  // ];
  return <UserItem resume={auth.resume} />;
};

export default Users;
