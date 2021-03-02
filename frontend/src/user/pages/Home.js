import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

// import  MainNavigation  from "../../shared/components/NavigationElements/MainNavigation";



const useStyles = makeStyles((theme) => ({}));

export default function Home(props) {
  const classes = useStyles();

  return (
    <Container>
          
      <CssBaseline />
    </Container>
  );
}

