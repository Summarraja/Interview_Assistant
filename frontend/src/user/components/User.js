import React from "react";
import UsersList from "./UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Muqaddas Pervez",
      city: "Islamabad",
      interviews: 4,
      certificates: 2,
      country: "Pakistan",
      profession: "Front-end Developer",
      image:
        "https://data.whicdn.com/images/295658437/original.jpg",
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
