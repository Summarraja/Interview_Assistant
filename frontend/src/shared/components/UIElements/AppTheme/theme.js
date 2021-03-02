import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#004777",
    },
    secondary: {
      main: "#4E78A0",
    },
  
  },
  typography: {
    fontFamily: "Serif, Open Sans, Arial",
    h3: {
      fontSize: "3rem",
    },
    h5: {
      fontSize: "1.5rem",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
       fontSize: "1em",
        color: "white",
        backgroundColor: "#004777",
       
      }
    }
  }, 
  
});

export default theme;
