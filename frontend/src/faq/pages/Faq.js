import React,{useContext, useEffect, useState} from "react";
import "./Faq.css";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { makeStyles, fade } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import SearchCandidates from "../../Interviews/components/SearchCandidates";
import { Card, Toolbar } from "@material-ui/core";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { Fragment } from "react";
import FaqCollection from "../components/FaqCollection";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 60,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
  },
  paper: {
    backgroundColor: "#4E78A0",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1, 1),

      width: "auto",
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(3, 10),
      width: "auto",
    },
  },
  whitePaper: {
    backgroundColor: "white",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1, 1),

      width: "auto",
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(3, 10),
      width: "auto",
    },
  },
  collapse: {
    width: "100%",
  },

  bgCard: {
    height: "48px",
    backgroundColor: "#d3d3d3",
    width: "60%",
    alignItems: "center",
    marginLeft: "20%",
    [theme.breakpoints.down("xs")]: {
      width: "80%",
      marginLeft: "10%",
    },
  },
  searchBar: {
    width: "100%",
  },
  searchedItems: {
    backgroundColor: "white",
    padding: 10

  },
  list: {
    padding: 0,
  },
  responsive: {
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
    },
  },
  listItem: {
    padding: "4px 8px",
  },
}));


export default function FAQ(props) {
  const [closeIcon, setCloseIcon] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const auth = useContext(AuthContext);
  const [faqs, setFaqs] = useState();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    setCloseIcon(false);
  }, [searchItem]);

  const MainHeading = {
    color: "white",
    padding: " 0px 30px 20px",
    width: "100%", 
    fontSize: "2.5rem"
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/faqs/'
        );
        setFaqs(responseData.faqs);
      } catch (err) {
        console.log(err)
      }
    }
    if (!faqs || closeIcon == false)
      getData();

  }, [faqs, closeIcon])

  const getSearchItem = () => {
    setCloseIcon(!closeIcon);
    const fetchSearchedFaqs = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/faqs/faq/${searchItem}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setFaqs(responseData.searchedFaq);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSearchedFaqs(); 
  };

  const classes = useStyles();
  return (
<Fragment>
 

      <div className={auth.isLoggedIn ?classes.root : ""} >
      <div className="TopHeader"  >
      <Toolbar/>
        <Typography variant="h4" align="center" style={MainHeading}>
          How can we help you?
        </Typography>
        <Card className={classes.bgCard}>
        <SearchCandidates
          className={classes.searchBar}
          setSearchItem={setSearchItem}
          searchItem={searchItem}
          getSearchItem={getSearchItem}
          closeIcon={closeIcon}
          setCloseIcon={setCloseIcon}
        />
      
      </Card>
      </div>
     
      <Paper elevation={10} className={(faqs && faqs.length === 0) ? classes.whitePaper : classes.paper}>
       <div className={classes.collapse}>
   {faqs &&  <FaqCollection
         faqs = {faqs}
      />
   }
      </div>
      </Paper>
      </div>
    </Fragment>
  );
}
