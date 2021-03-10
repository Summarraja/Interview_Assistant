import React from "react";
import Container from "@material-ui/core/Container";
import Users from "../components/User";
import { CssBaseline } from "@material-ui/core";

export default function UserProfile() {

  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Users />
    </Container>
  );
}
