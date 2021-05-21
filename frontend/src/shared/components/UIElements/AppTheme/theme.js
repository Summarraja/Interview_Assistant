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
     button: {
      fontFamily: "Serif, Open Sans, Arial",
    },
    h3: {
      fontSize: "3rem",
    },
    h4:{
      fontSize: "1.7rem"
    },
    h5: {
      fontSize: "1.5rem",
    },
    h6: {
      fontSize: "1.1rem",
      fontWeight: "bold",
    },
    body1:{
      fontSize: "1rem",
    }
  },

  overrides: {
    MuiTab: {
      wrapper: {
       fontFamily:"Serif, Open Sans, Arial",
       fontSize: "1.1rem"
       
      }
    }, 
    MuiTooltip: {
      tooltip: {
       fontSize: "1em",
        color: "white",
        backgroundColor: "#004777",
      }
    }, 
    MuiButton:{
      label: {
        fontFamily:"Serif, Open Sans, Arial",
        fontSize: "0.9rem"
      }
    }, 
    MuiMenuItem:{
      root:{
        whiteSpace: "none"
      }
    }
  }, 

});

export default theme;
